import './index.scss'

import { Button, Spin } from 'antd'
import { CalendarOutlined, ColumnWidthOutlined, LoadingOutlined } from '@ant-design/icons'

import { FaMapMarkerAlt, FaSatellite } from 'react-icons/fa'
import { SiSpeedtest } from 'react-icons/si'
import { BiArea } from 'react-icons/bi'
import { GiPathDistance } from 'react-icons/gi'
import { BsArrowDownCircle } from 'react-icons/bs'

import BackButton from '../../../BackButton'
import useFetch from '../../../../hooks/useFetch'
import { ENDPOINT_URL } from '../../../../app/config'
import { useEffect } from 'react'

const RecordInfoItem = ({ icon, title, content }: any) => {
    return (
        <div className="record-info-item">
            <div className="record-info-item-icon">{icon}</div>
            <div className="record-info-item-stats">
                <div className="record-info-item-content">{content}</div>
                <div className="record-info-item-title">{title}</div>
            </div>
        </div>
    )
}

const RecordInfo = ({ data, taskData, deviceData, isFetching }: any) => {
    let total = {
        speed: 0,
        accuracy: 0,
    }

    data?.speed?.forEach((stat: any) => {
        total.speed += stat
    })
    data?.accuracy?.forEach((stat: any) => {
        total.accuracy += stat
    })

    const average = {
        speed: total.speed / data?.speed?.length,
        accuray: total.accuracy / data?.accuracy?.length,
    }

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

    function download(blob: any, filename: any) {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        // the filename you want
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const handleCreateFile = () => {
        if (taskData?.task_id && deviceData?.id)
            fetch(ENDPOINT_URL + '/task-export/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task_id: taskData.task_id,
                    device_id: deviceData.id,
                }),
            })
                .then((res) => res.blob())
                .then((blob) => download(blob, 'task_csv'))
    }

    return (
        <div className="record-info-container">
            <div className={`record-info-content`}>
                {isFetching && <Spin indicator={antIcon} tip="??ang t???i l??? tr??nh..." />}
                {!isFetching && (
                    <>
                        <div className="record-info-title">Thi???t b??? {deviceData?.name}</div>
                        <RecordInfoItem icon={<CalendarOutlined />} title="Ng??y b???t ?????u" content="20/10/2021 10:20 am" />
                        <RecordInfoItem icon={<BiArea />} title="Di???n t??ch l??m vi???c" content="0 km2" />
                        <RecordInfoItem icon={<ColumnWidthOutlined />} title="????? r???ng ???????ng l??m vi???c" content="0 m" />
                        <RecordInfoItem icon={<GiPathDistance />} title="T???ng qu??ng ???????ng" content={`${data.distance?.[data.distance?.length - 1]?.toFixed(2) ?? ''} m`} />
                        <RecordInfoItem icon={<FaMapMarkerAlt />} title="????? ch??nh x??c trung b??nh" content={`${average.accuray.toFixed(2) ?? ''} cm`} />
                        <RecordInfoItem icon={<SiSpeedtest />} title="T???c ????? trung b??nh" content={`${average.speed.toFixed(2) ?? ''} km/h`} />
                        <RecordInfoItem icon={<FaSatellite />} title="GNSS" content={taskData?.gnss ?? ''} />
                        <div className="record-info-control">
                            <BackButton route={`/devices/${deviceData?.id}`} />
                            <Button onClick={handleCreateFile}>
                                <BsArrowDownCircle />
                                Xu???t d??? li???u
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default RecordInfo
