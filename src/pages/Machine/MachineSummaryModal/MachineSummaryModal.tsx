import style from './index.module.scss'
import { Button, Table } from 'antd'
import useFetch from '../../../hooks/useFetch'
import { useEffect, useState } from 'react'
import { ENDPOINT_URL } from '../../../app/config'
import AddModal from '../../../components/AddModal'

const column = [
    {
        key: 'ckey',
        dataIndex: 'ckey',
        render: (text: string) => (
            <h6 style={{ fontWeight: 'bold' }}>{text}</h6>
        ),
    },
    {
        key: 'value',
        dataIndex: 'value',
    },
]

// const dataSource = [
//     {
//         key: '1',
//         ckey: 'Mã dự án',
//         value: 'DP CM',
//     },
//     {
//         key: '2',
//         ckey: 'Tên gói thầu',
//         value: 'Gói thầu số 14',
//     },
//     {
//         key: '3',
//         ckey: 'Mô tả tổng quan',
//         value: 'Dự án đê chắn sóng là dự án hạng tầng kĩ thuật',
//     },
//     {
//         key: '4',
//         ckey: 'Thời gian thi công',
//         value: '18/12/2017 - 31/12/2022',
//     },
//     {
//         key: '5',
//         ckey: 'Địa điểm thi công',
//         value: 'Thừa thiên Huế',
//     },
//     {
//         key: '6',
//         ckey: 'Giá trị hợp đồng',
//         value: '100 tỷ',
//     },
//     {
//         key: '7',
//         ckey: 'Thời gian hợp đồng',
//         value: '18/12/2017 - 31/12/2022',
//     },
//     {
//         key: '8',
//         ckey: 'Vai trò tham gia dự án',
//         value: 'Nhà thầu chính',
//     },
//     {
//         key: '9',
//         ckey: 'Nguồn vốn thực hiện',
//         value: 'Ngân sách',
//     },
//     {
//         key: '10',
//         ckey: 'Chủ đầu tư',
//         value: 'Không',
//     },
//     {
//         key: '11',
//         ckey: 'Tư vấn thiết kế',
//         value: 'Tư vấn cảng đường thủy',
//     },
//     {
//         key: '12',
//         ckey: 'Tư vấn giám sát',
//         value: 'ALD',
//     },
//     {
//         key: '13',
//         ckey: 'Lãnh đạo',
//         value: 'Phạm kim châu',
//     },
//     {
//         key: '14',
//         ckey: 'Phòng qlda',
//         value: 'phòng qlda1',
//     },
//     {
//         key: '15',
//         ckey: 'Đơn vị thi công',
//         value: 'phòng hcns',
//     },
//     {
//         key: '16',
//         ckey: 'Loại công trình',
//         value: 1,
//     },
//     {
//         key: '17',
//         ckey: 'Cấp công trình',
//         value: 1,
//     },
//     {
//         key: '18',
//         ckey: 'Giá trị thực hiện',
//         value: '100 Tỷ VNĐ',
//     },
//     {
//         key: '19',
//         ckey: 'Tỉ lệ hoàn thiện',
//         value: '100%',
//     },
// ]

const IKeyCode = {
    name: {
        brand: 'Tên máy móc',
        type: 'string',
    },
    model: {
        brand: 'Kiểu xe',
        type: 'string',
    },
	description: {
        brand: 'Mô tả tổng quan',
        type: 'string',
    },
    driver: {
        brand: 'Lái máy',
        type: 'string',
    },
    create_time: {
        brand: 'Thời gian tạo',
        type: 'date',
    },
    update_time: {
        brand: 'Thời gian cập nhật',
        type: 'date',
    },
    start_time: {
        brand: 'Thời gian bắt đầu',
        type: 'date',
    },
    end_time: {
        brand: 'Thời gian kết thúc',
        type: 'date',
    },
}

interface ISummaryMachineModal {
    centered?: boolean
    width?: number
    visible: boolean
    onClose: () => void
    id: number
}

const MachineSummaryModal: React.FC<ISummaryMachineModal> = ({
    id,
    onClose,
    visible,
    ...props
}) => {
    const [data, setData] = useState<any>()
    const [dataSource, setDataSource] = useState<any>()
    const [response, isFetching, setRequest] = useFetch({} as any)

    useEffect(() => {
        if (visible)
            setRequest({
                endPoint: ENDPOINT_URL + '/machine/',
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                requestBody: {
                    action: 'read',
                    pk: id,
                },
            })
    }, [visible])

    useEffect(() => {
        if (!isFetching && response && response.data && !response.hasError) {
            setData(response.data)
        }
    }, [response])

    useEffect(() => {
        const convertDataSource = []
        if (data) {
            for (const [key, value] of Object.entries(data)) {
                if ((IKeyCode as any)[key]) {
					const {brand, type} = (IKeyCode as any)[key]
                    const pushData = {
                        ckey:  brand,
                        value: value,
                    }
					if(type === "date")
					pushData.value = new Date(value as any).toLocaleString() 
                    convertDataSource.push(pushData)
                }
            }
        }
        setDataSource(convertDataSource)
    }, [data])

    return (
        <div className={style.machine_summary_container}>
            <AddModal
                {...props}
                visible={visible}
                onCancel={onClose}
                width={600}
                title={`Dự án ${data?.name}`}
                footer={<Button onClick={onClose}>Đóng</Button>}
            >
                <div className={style.machine_summary_content}>
                    <Table
                        className={style.machine_table_content}
                        columns={column}
                        dataSource={dataSource}
                        showHeader={false}
                        pagination={false}
                        loading={isFetching}
                    />
                </div>
            </AddModal>
        </div>
    )
}

export default MachineSummaryModal
