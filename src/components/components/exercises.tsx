import { ReactNode, useEffect, useState } from 'react'
import '../diary.scss'
import Loading from './loading'
import { useActions } from '../../store/hooks/useActions'
import { Iexercises } from '../types'
import { Button, Input, Modal, Space } from 'antd'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { FetchFn } from '../ADDITIONAL'

const Exercises: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [exercisesData, setExercisesData] = useState<Iexercises[]>([])
    const [exercises, setExercises] = useState<ReactNode[]>([])
    const { errorMessage } = useActions()
    const [openTimetable, setOpenTimeTable] = useState(false)

    const DataAPI = (data: Iexercises[]): void => {
        setExercisesData(data)
    }

    useEffect(() => {
        const Exercises: ReactNode[] = []
        exercisesData.forEach(el => {
            if (el.changes != "delete") {
                Exercises.push(<div key={el.exercise + el.id}>
                    <Input
                        defaultValue={el.exercise}
                        onBlur={value => {
                            setExercisesData(prevData => {
                                const answer: Iexercises[] = prevData.map(el3 => {
                                    if (el.id === el3.id) {
                                        return {
                                            exercise: value.target.value,
                                            id: el.id,
                                            changes: el.changes === "new" ? "new" : "changed"
                                        }
                                    } else {
                                        return el3
                                    }
                                })
                                return answer
                            })
                        }}
                        addonAfter={<DeleteOutlined onClick={() => {
                            setExercisesData(prevData => {
                                const answer: Iexercises[] = []
                                prevData.forEach(el3 => {
                                    if (el.id === el3.id) {
                                        if (el.changes != "new") {
                                            answer.push({
                                                exercise: el3.exercise,
                                                id: el3.id,
                                                changes: "delete"
                                            })
                                        }
                                    } else {
                                        answer.push(el3)
                                    }
                                })
                                return answer
                            })

                        }} />} />
                </div>)
            }
        })
        setExercises(Exercises)
    }, [exercisesData])

    const setNewValues = () => {

        const insert_data: string[] = []
        const update_data: Iexercises[] = []
        const delete_data: number[] = []

        exercisesData.forEach(el => {
            if (el.changes === "changed" && el.exercise != "") {
                update_data.push({ exercise: el.exercise, id: el.id })
            }
            if (el.changes === "delete") {
                delete_data.push(el.id)
            }
            if (el.changes === "new" && el.exercise != "") {
                insert_data.push(el.exercise)
            }
        })
        FetchFn({
            type: "update_exercises",
            for_insert: JSON.stringify(insert_data),
            for_delete: JSON.stringify(delete_data),
            for_update: JSON.stringify(update_data),
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
                <Space align='center' direction='vertical'>

                    <Space style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", justifyContent: "center" }}>{exercises}</Space>
                    <Button onClick={() => {
                        setExercisesData(prevData => ([...prevData, { exercise: "", id: Math.floor(Math.random() * 100) }]))
                    }}>додати</Button>
                </Space>}
        </Modal>
        <Button onClick={() => {
            FetchFn({ type: "get_exercises" }, DataAPI, setLoading, errorMessage)
            setOpenTimeTable(true)
        }} >вправи</Button>
    </>)

}

export default Exercises