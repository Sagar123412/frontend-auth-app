import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, theme, Typography } from "antd";
import { Link } from "react-router-dom";
import TenantFilter from "./TenantFilter";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { numberOfRecordPerPage } from "../../constants";
import { createTenant, getTenants } from "../../http/api";
import { useAuthStore } from "../../store";
import type { CreateTenantData, FieldData } from "../../types";
import { debounce } from "lodash";
import TenantForm from "./form/TenantForm";


const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

function Tenants() {

    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();

    const { user } = useAuthStore();

    const queryClient = useQueryClient();


    const [queryParams, setQueryParams] = React.useState({
        perPage: numberOfRecordPerPage,
        currentPage: 1,
    });

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const {
        token: { colorBgLayout },
    } = theme.useToken();



    const debouncedQUpdate = React.useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value }));
        }, 500);
    }, []);


    const onFilterChange = (changedFields: FieldData[]) => {
        const changedFilterFields = changedFields
            .map((item) => ({
                [item.name[0]]: item.value,
            }))
            .reduce((acc, item) => ({ ...acc, ...item }), {});

        if ('q' in changedFilterFields) {
            debouncedQUpdate(changedFilterFields.q);
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedFilterFields }));
        }
    };


    // getting tenants by search query

    const {
        data: tenants,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['tenants', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1])
            );

            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString();

            return getTenants(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData,
    });


    //creating a new tenant

    const { mutate: tenantMutate } = useMutation({
        mutationKey: ['tenant'],
        mutationFn: async (data: CreateTenantData) => createTenant(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            return;
        },
    });


    //handing form submission of new tenant

    const onHandleSubmit = async () => {
        await form.validateFields();
        await tenantMutate(form.getFieldsValue());
        form.resetFields();
        setDrawerOpen(false);
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Flex justify="space-between">
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Tenants' }]}
                />
                {isFetching && (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                )}
                {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
            </Flex>

            <Form form={filterForm} onFieldsChange={onFilterChange}>
                <TenantFilter>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}>
                        Add Restaurant
                    </Button>
                </TenantFilter>
            </Form>

            <Table
                columns={columns}
                dataSource={tenants?.data}
                rowKey={'id'}
                pagination={{
                    total: tenants?.total,
                    pageSize: queryParams.perPage,
                    current: queryParams.currentPage,
                    onChange: (page) => {
                        console.log(page);
                        setQueryParams((prev) => {
                            return {
                                ...prev,
                                currentPage: page,
                            };
                        });
                    },
                }}
            />

            <Drawer
                title="Create restaurant"
                styles={{ body: { backgroundColor: colorBgLayout } }}
                width={720}
                destroyOnClose={true}
                open={drawerOpen}
                onClose={() => {
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
                    <TenantForm />
                </Form>
            </Drawer>
        </Space>
    )
}

export default Tenants