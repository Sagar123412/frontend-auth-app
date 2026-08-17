import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../store"
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, theme } from "antd";
import { useState } from "react";
import Logo from "../components/login/icons/Logo";
import Icon, { BellFilled } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
import Home from "../components/login/icons/Home";
import { foodIcon } from "../components/login/icons/FoodIcon";
import BasketIcon from "../components/login/icons/BasketIcon";
import GiftIcon from "../components/login/icons/GiftIcon";


const { Sider, Header, Content, Footer } = Layout;

const getMenuItems = (role: string) => {
    const baseItems = [
        {
            key: '/',
            icon: <Icon component={Home} />,
            label: <NavLink to="/">Home</NavLink>,
        },

        {
            key: '/products',
            icon: <Icon component={foodIcon} />,
            label: <NavLink to="/products">Products</NavLink>,
        },
        {
            key: '/orders',
            icon: <Icon component={BasketIcon} />,
            label: <NavLink to="/orders">Orders</NavLink>,
        },
        {
            key: '/promos',
            icon: <Icon component={GiftIcon} />,
            label: <NavLink to="/promos">Promos</NavLink>,
        },
    ];

    return baseItems;
};


function Dashboard() {
    const location = useLocation();

    const { logout: logoutFromStore } = useAuthStore();

    const { mutate: logoutMutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: async () => {
            logoutFromStore();
            return;
        },
    });

    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();


    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to={"/auth/login"} />
    }

    const items = getMenuItems(user.role);


    return (
        <div>
            <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
                <Sider
                    collapsible
                    theme="light"
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo">
                        <Logo />
                    </div>

                    <Menu
                        theme="light"
                        defaultSelectedKeys={[location.pathname]}
                        mode="inline"
                        items={items}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{
                            paddingLeft: '16px',
                            paddingRight: '16px',
                            background: colorBgContainer,
                        }}>
                        <Flex gap="middle" align="start" justify="space-between">
                            <Badge
                                text={
                                    user.role === 'admin' ? 'You are an admin' : user.tenant?.name
                                }
                                status="success"
                            />
                            <Space size={16}>
                                <Badge dot={true}>
                                    <BellFilled />
                                </Badge>
                                <Dropdown
                                    menu={{
                                        items: [
                                            {
                                                key: 'logout',
                                                label: 'Logout',
                                                onClick: () => logoutMutate(),
                                            },
                                        ],
                                    }}
                                    placement="bottomRight">
                                    <Avatar
                                        style={{
                                            backgroundColor: '#fde3cf',
                                            color: '#f56a00',
                                        }}>
                                        U
                                    </Avatar>
                                </Dropdown>
                            </Space>
                        </Flex>
                    </Header>
                    <Content style={{ margin: '24px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Mernspace pizza shop</Footer>
                </Layout>
            </Layout>
        </div>
    )
}

export default Dashboard