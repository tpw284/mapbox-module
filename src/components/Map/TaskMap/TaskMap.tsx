import './index.css'
import { createContext, useEffect, useState } from 'react'
import * as turf from '@turf/turf'

import Mapbox from '../Mapbox'
import RecordInfo from '../RecordMap/RecordInfo'
import { useLocation } from 'react-router'
import useFetch from '../../../hooks/useFetch'
import Chart from '../RecordMap/Chart'

export const ViewIndexContext = createContext<any>(null)

const TaskMap = ({ match }: any) => {
    const location = useLocation()
    const arr = location.pathname.split('/')
    const id = arr[arr.length - 2]

    const [taskData, setTaskData] = useState<any>([])
    const [taskIdOption, setTaskIdOption] = useState<any[]>([])
    const [drawData, setDrawData] = useState<any>([])
    const [viewIndex, setViewIndex] = useState(0)

    

    const [selectedTask, setSelectedTask] = useState(-1)

    const [tasksResponse, isFetchingAllTask, setRequestAllTask] = useFetch(
        {} as any
    )
    const [singleTaskResponse, isFetchingSingleTask, setRequestSingleTask] =
        useFetch({} as any)

    useEffect(() => {
        setRequestAllTask({
            endPoint: 'https://dinhvichinhxac.online/api/task/',
            method: 'GET',
        })
    }, [])

    useEffect(() => {
        if (
            !isFetchingAllTask &&
            tasksResponse &&
            tasksResponse.data &&
            !tasksResponse.hasError
        )
            setTaskIdOption(
                tasksResponse.data
                    .map((task: any) => ({
                        id: task.id,
                        deviceId: task.device_id,
                    }))
                    .filter((taskId: any) => taskId.deviceId.toString() === id)
                    .map((task: any) => task.id)
            )
    }, [tasksResponse])

    useEffect(() => {
        const query = {
            action: 'read',
            pk: selectedTask,
        }
        if (selectedTask >= 0)
            setRequestSingleTask({
                endPoint: 'https://dinhvichinhxac.online/api/task/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                requestBody: query,
            })
    }, [selectedTask])

    useEffect(() => {
        if (
            !isFetchingSingleTask &&
            singleTaskResponse &&
            singleTaskResponse.data &&
            !singleTaskResponse.hasError
        ) {
            let graphData = {
                distance: [0],
                accuracy: [0],
                speed: [0],
                xAxis: [0],
            }
            let from
            let to = [0, 0]
            const points = singleTaskResponse.data?.positions || []
            let convertData: any[] = []
            points.forEach((point: any, index: number) => {
                const latitude = point[0];
                const longitude = point[1];
                const accuracy = point[3];
                const speed = point[4];
                const timestamp = point[5];

                const currentCoord = [longitude, latitude]
                convertData.push(currentCoord)
                from = to
                to = currentCoord
                if (index > 0) {
                    graphData.speed.push(speed)
                    graphData.accuracy.push(accuracy)
                    graphData.distance.push(
                        graphData.distance[graphData.distance.length - 1] +
                            turf.distance(turf.point(from), turf.point(to)) *
                                1000
                    )
                    graphData.xAxis.push(index)
                }
            })
            setTaskData(graphData)
            setDrawData(convertData)
            setViewIndex(convertData.length)
        }
    }, [singleTaskResponse])

    return (
        <div className="task-view">
            <div className="task-control-container">
                <div className="task-map">
                    <ViewIndexContext.Provider value={viewIndex}>
                        <Mapbox
                            height="calc(70vh - 85px)"
                            width="100%"
                            viewDrawData={drawData}
                            multiple
                            center={drawData?.[0]}
                            viewIndexContextKey={"task"}
                        ></Mapbox>
                    </ViewIndexContext.Provider>
                </div>
                <div className="task-control-chart">
                    <Chart taskData ={taskData} setViewIndex={setViewIndex} />
                </div>
            </div>
            <div className="task-graph">
                <RecordInfo
                    data={taskData}
                    options={taskIdOption}
                    changeSelectTask={setSelectedTask}
                    isFetching={isFetchingSingleTask}
                />
            </div>
        </div>
    )
}

export default TaskMap
