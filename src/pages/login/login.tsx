import { Alert, Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { KeyOutlined, LockFilled, UserOutlined } from "@ant-design/icons";
import Logo from "../../components/login/icons/Logo";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { login, self, logout } from "../../http/api";
import type { Credentials } from "../../types";
import { usePermission } from "../../hooks/usePermission";
import { useAuthStore } from "../../store";


const signin = async (credentials: Credentials) => {
    const { data } = await login(credentials);
    return data;
};

const getSelf = async () => {
    const { data } = await self();
    return data;
};


const Login = () => {
    const { isAllowed } = usePermission();
    const { setUser, logout: authLogoutStore } = useAuthStore();


    const { refetch: refetchSelf } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        enabled: false, // Disable automatic fetching on mount
    });

    const { mutate: logoutMutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            authLogoutStore();
        }
    });


    const { mutate, isError, isPending, error } = useMutation({
        mutationKey: ['login'],
        mutationFn: signin,
        onSuccess: async (data) => {
            const selftApiPromise = await refetchSelf();

            // logout or redirect to client ui, if this is a customer
            // window.location.href = "http://clientui/url"
            // "admin", "manager", is only allowed to access the admin ui


            if (!isAllowed(selftApiPromise.data)) {

                logoutMutate();
                // logout or redirect to client ui, if this is a customer
                // window.location.href = "http://clientui/url"
                return;

            }

            setUser(selftApiPromise.data);
        },
    });


    return (
        <Layout style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
            <Space orientation="vertical" align="center" size="large">
                <Layout.Content>
                    <Logo />
                </Layout.Content>

                <Card title={
                    <Space
                        style={{ width: '100%', fontSize: 16, justifyContent: 'center' }}>
                        <LockFilled />
                        Sign in
                    </Space>
                }
                    style={{ width: 300 }}
                    bordered={false}
                >
                    <Form
                        initialValues={{
                            remember: true,
                        }}

                        onFinish={(values) => {
                            mutate(values);
                        }}
                    >
                        {
                            isError && (
                                <Alert
                                    style={{ marginBottom: 24 }}
                                    type="error"
                                    message={error?.message}
                                />
                            )
                        }
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!'
                                },
                                {
                                    type: 'email',
                                    message: 'Email is not valid',
                                },]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password prefix={<KeyOutlined />} placeholder="Password" />
                        </Form.Item>

                        <Flex justify="space-between">
                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <a href="" id="login-form-forgot">
                                Forgot password
                            </a>
                        </Flex>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={isPending}>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Space>
        </Layout>
    );
}

export default Login;