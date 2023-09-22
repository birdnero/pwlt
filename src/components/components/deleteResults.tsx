import { ReactNode, useEffect, useState } from 'react'
import '../diary.scss'
import Loading from './loading'
import { useActions } from '../../store/hooks/useActions'
import { Iexercises } from '../types'
import { Button, Modal, Space } from 'antd'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { FetchFn } from '../ADDITIONAL'

const DeleteResults: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [exercisesData, setExercisesData] = useState<Iexercises[]>([])
    const [exercises, setExercises] = useState<ReactNode[]>([])
    const [delete_data, setDelete_data] = useState<string[]>([])
    const { errorMessage } = useActions()
    const [openTimetable, setOpenTimeTable] = useState(false)

    const DataAPI = (data: Iexercises[]): void => {
        setExercisesData(data)
    }

    useEffect(() => {
        const Exercises: ReactNode[] = []
        exercisesData.forEach(el => {
            if (el.changes != "delete") {
                Exercises.push(<Space align='center' style={{ width: "100%" }} key={el.exercise + el.id}>
                    <div>{el.exercise}</div>
                    <DeleteOutlined onClick={() => {
                        setExercisesData(prevData => {
                            const answer: Iexercises[] = []
                            prevData.forEach(el3 => {
                                if (el.id === el3.id) {
                                    answer.push({
                                        exercise: el3.exercise,
                                        id: el3.id,
                                        changes: "delete"
                                    })
                                    setDelete_data(prevData3 => ([...prevData3, el3.exercise]))
                                } else {
                                    answer.push(el3)
                                }
                            })
                            return answer
                        })

                    }} />
                </Space>)
            }
        })
        setExercises(Exercises)
    }, [exercisesData])

    const setNewValues = () => {
        FetchFn({
            type: "delete_results",
            delete: JSON.stringify(delete_data)
        }, () => {
            setOpenTimeTable(false)
        }, setLoading2, errorMessage)
    }


    return (<>
        <Modal
            className="timetable_modal"
            title={false}
            open={openTimetable}
            onCancel={() => {
                setOpenTimeTable(false)
            }}
            onOk={() => {
                setNewValues()
            }}
            okButtonProps={{ icon: loading2 ? <LoadingOutlined /> : null }}
        >
            {loading ? <Loading /> :
                <Space style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                    {exercises}
                    <Button onClick={()=>{
                        FetchFn({
                            type: "delete_unisset_results",
                            delete: JSON.stringify(exercisesData.map(el=>el.exercise))
                        }, () => {
                            setOpenTimeTable(false)
                        }, setLoading2, errorMessage)
                    }}>видалити не існуючі вправи</Button>
                </Space>}
        </Modal>
        <Button onClick={() => {
            FetchFn({ type: "get_exercises" }, DataAPI, setLoading, errorMessage)
            setOpenTimeTable(true)
        }} >видалити...</Button>
    </>)

}

export default DeleteResults