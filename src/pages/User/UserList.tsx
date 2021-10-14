import './index.css'
import columns from './columns'
import { Input, Modal, Space, Table } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useState } from 'react'
import faker from 'faker'
import { Link } from 'react-router-dom'
import UserDetail from '../../components/User/UserDetail/UserDetail'

const UserList = () => {
    const tableColumns = [
        ...columns.slice(0, 1),
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => (
                <Link to={`/users/${record.index}`}>{text}</Link>
            ),
        },
        ...columns.slice(1),
        {
            title: 'Thao tác',
            key: 'action',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <button>SMS</button>
                    <button>Chi tiết</button>
                    <button>Cập nhật</button>
                    <button>Xoá</button>
                </Space>
            ),
        },
    ]
    const data = []
    for (let i = 0; i < 50; i++) {
        data.push({
            index: i,
            name: faker.name.findName(),
            username: faker.internet.userName(),
            phone: faker.phone.phoneNumber(),
            role: faker.name.jobTitle(),
            project: faker.address.state()
        })
    }
    return (
        <div className="users-list-wrapper">
            <div className="users-list-control">
                <div className="users-list-control-search">
                    <Input
                        prefix={
                            <SearchOutlined className="site-form-item-icon" />
                        }
                    />
                </div>
                <div className="users-list-control-actions">
                    <PlusOutlined />
                </div>
            </div>
            <div className="users-list-table">
                <Table columns={tableColumns} dataSource={data} bordered />;
            </div>
        </div>
    )
}

export default UserList
