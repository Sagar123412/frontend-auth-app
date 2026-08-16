import { Alert, Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { KeyOutlined, LockFilled, UserOutlined } from "@ant-design/icons";
import Logo from "../../components/login/icons/Logo";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../http/api";
import type { Credentials } from "../../types";


const signin = async (credentials: Credentials) => {
    const { data } = await login(credentials);
    return data;
};

const Login = () => {

    const { mutate, isError, isPending, error } = useMutation({
        mutationKey: ['login'],
        mutationFn: signin,
        onSuccess: (data) => {
            console.log('Login successful:', data);
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