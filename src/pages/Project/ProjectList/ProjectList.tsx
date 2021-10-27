import './index.css'

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button, Input, Modal, Space, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import columns from './columns'
import ProjectSummary from '../ProjectSummary'
import faker from 'faker'
import useFetch from '../../../hooks/useFetch'
import ProjectAddModal from '../ProjectAddModal'

const ProjectList = () => {
    const [isModalVisible, setIsModalVisible] = useState(false)

    const handleAddProject = () => {
        showModal()
    }
    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }
    const handleClick = () => {
        showModal()
    }

    const tableColumns = [
        ...columns.slice(0, 1),
        {
            title: 'Tên dự án',
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => (
                <Link to={`/projects/${record.key}`}>{text}</Link>
            ),
        },
        ...columns.slice(1),
        {
            title: 'Thao tác',
            key: 'action',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <button onClick={handleClick}>Info</button>
                    <button>Delete</button>
                </Space>
            ),
        },
    ]
    const [data, setData] = useState([])
    const [response, isFetching, setRequest] = useFetch({} as any)
    useEffect(() => {
        setRequest({
            endPoint: 'https://dinhvichinhxac.online/api/project/',
            method: 'GET',
        })
    }, [])

    useEffect(() => {        
        if (!isFetching && response && response.data && !response.hasError) {
            setData(response.data)
        }
    }, [response])
    // const data = []
    // for (let i = 0; i < 50; i++) {
    //     data.push({
    //         key: i,
    //         code: faker.datatype.string(),
    //         name: faker.name.findName(),
    //         contractValuation: faker.datatype.number(),
    //         valuation: faker.datatype.number(),
    //         percentage: faker.datatype.number(),
    //         contractTime: faker.datatype.number(),
    //         time: faker.datatype.number(),
    //         remainTime: faker.datatype.number(),
    //     })
    // }
    return (
        <div className="projects-list-wrapper">
            <div className="projects-list-control me-5">
                <div className="projects-list-control-search">
                    <Input
                        prefix={
                            <SearchOutlined className="site-form-item-icon" />
                        }
                    />
                </div>
                <div className="projects-list-control-actions">
                    <Button onClick={handleAddProject}>Thêm</Button>
                </div>
            </div>
            <div className="projects-list-table">
                <Table columns={tableColumns} dataSource={data} bordered />;
            </div>
            <ProjectAddModal
                centered
                width={1000}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            />
        </div>
    )
}

export default ProjectList
