import './index.css'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router'

import { Button, DatePicker, Empty, Input, Spin, Table } from 'antd'
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons'

import columns from './columns'
import useFetch from '../../../../hooks/useFetch'
import TaskList from './TaskList'
const { RangePicker } = DatePicker

const DeviceDetailItem = ({ data }: any) => {
    const { task } = data
    return (
        <div className="device-detail-item-wrapper">
            <div className="device-detail-item-title">Ngày {data.date}</div>
            <div className="device-tasks-list-table">
                <div className="text-start fw-bold fs-5 mb-3">
                    Thông số trong ngày
                </div>
                <Table
                    columns={columns}
                    dataSource={[data]}
                    bordered
                    pagination={false}
                />
            </div>
            <div>{task && <TaskList data={task} />}</div>
        </div>
    )
}

const DeviceDetail = ({ id, currentDateData }: any) => {
    const history = useHistory()
    const location = useLocation()

    const handleShowTracks = () => {
        history.push(location.pathname + '/tasks')
    }

    const [response, isFetching, setRequest] = useFetch({} as any)
    const [data, setData] = useState<any[]>([])

    const handleChangeDate = (dates: any, dateString: any) => {
        const start = dateString[0].split('-').reverse().join('/') + ' 0:00:00'
        const end = dateString[1].split('-').reverse().join('/') + ' 23:59:59'
        console.log(start, end)
        setRequest({
            endPoint: 'https://dinhvichinhxac.online/api/task-info/',
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            requestBody: {
                device_id: id,
                start: start,
                end: end,
            },
        })
    }

    useEffect(() => {
        const convertData = []
        for (const [key, value] of Object.entries(currentDateData)) {
            convertData.push({
                ...(value as any),
                date: key,
            })
        }
        setData(convertData)
    }, [currentDateData])

    useEffect(() => {
        if (!isFetching && response && response.data && !response.hasError) {
            const convertData = []
            for (const [key, value] of Object.entries(response.data)) {
                convertData.push({
                    ...(value as any),
                    date: key,
                })
            }
            setData(convertData)
        }
    }, [response])

    const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />

    return (
        <div className="device-detail">
            <div className="device-tasks-list-wrapper">
                <div className="device-tasks-list-control">
                    <div className="device-tasks-list-control-search">
                        <Input
                            prefix={
                                <SearchOutlined className="site-form-item-icon" />
                            }
                        />
                    </div>
                    <div className="device-tasks-list-calendar">
                        <RangePicker onChange={handleChangeDate} />
                    </div>
                    <div className="device-tasks-list-control-actions">
                        <Button onClick={handleShowTracks}>
                            Hành trình của thiết bị
                        </Button>
                    </div>
                </div>
                {isFetching && <Spin indicator={antIcon} />}
                {data &&
                    data.map((deviceData) => (
                        <DeviceDetailItem
                            key={deviceData.date}
                            data={deviceData}
                        />
                    ))}
                {data.length === 0 && (
                    <div>
                        <Empty />
                    </div>
                )}
            </div>
        </div>
    )
}

export default DeviceDetail
