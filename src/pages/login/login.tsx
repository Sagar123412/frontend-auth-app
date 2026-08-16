import { Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { KeyOutlined, LockFilled, UserOutlined } from "@ant-design/icons";
import Logo from "../../components/login/icons/Logo";

const Login = () => {
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
                    style={{ width: 300 }}>
                    <Form
                        initialValues={{
                            remember: true,
                        }}

                        onFinish={(values) => {
                            console.log('Success:', values);
                        }}
                    >
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
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
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