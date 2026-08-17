import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Space, Spin, Table } from "antd";
import { Link } from "react-router-dom";
import { getUsers } from "../../http/api";
import type { User } from "../../types";



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

                    <Table columns={columns} dataSource={usersList?.data || []} />
                </div>
            </Space>
        </div>
    )
}
