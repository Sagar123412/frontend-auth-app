import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Breadcrumb, Button, Drawer, Form, Space, Spin, Table, theme } from "antd";
import { Link, Navigate } from "react-router-dom";
import { createUser, getUsers } from "../../http/api";
import type { CreateUserData, User } from "../../types";
import UserFilter from "./Forms/UserFilter";
import React from "react";
import UserForm from "./Forms/UserForm";
import { useAuthStore } from "../../store";



const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_text: string, record: User) => {
            return (
                <div>
                    {record.firstName} {record.lastName}
                </div>
            );
        },
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
];


export default function User() {
    const { user } = useAuthStore();

    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const {
        token: { colorBgLayout },
    } = theme.useToken();

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace={true} />;
    }

    const {
        data: usersList,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['users'],
        queryFn: () => {
            return getUsers().then((res) => res.data);
        },
    });


    const { mutate: userMutate } = useMutation({
        mutationKey: ['user'],
        mutationFn: async (data: CreateUserData) => createUser(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            return;
        },
    });


    const onHandleSubmit = async () => {
        await form.validateFields();
        await userMutate(form.getFieldsValue());
        form.resetFields();
        setDrawerOpen(false);
    };


    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[
                            {
                                title: <Link to={'/'}>Dashboard</Link>
                            },
                            {
                                title: <Link to={'/users'}>users</Link>
                            },
                        ]}
                    />
                </div>
                <div>
                    {isLoading && <Spin indicator={<LoadingOutlined spin />} size="medium" />
                    }
                    {isError && <div>{error.message}</div>}

                    <UserFilter
                        onFilterChange={(filterName: string, filterValue: string) => {
                            console.log(filterName, filterValue);
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setDrawerOpen(true)}>
                            Add User
                        </Button>
                    </UserFilter>

                    <Table columns={columns} dataSource={usersList?.data || []} />
                </div>

                <Drawer
                    title="Create user"
                    width={720}
                    styles={{ body: { backgroundColor: colorBgLayout } }}
                    destroyOnClose={true}
                    open={drawerOpen}
                    onClose={() => {
                        form.resetFields();
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    setDrawerOpen(false);
                                }}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={onHandleSubmit}>
                                Submit
                            </Button>
                        </Space>
                    }>
                    <Form layout="vertical" form={form}>
                        <UserForm />
                    </Form>
                </Drawer>
            </Space>
        </div>
    )
}
