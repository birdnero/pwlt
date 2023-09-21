import { Button, DatePicker, InputNumber, Modal, Select, SelectProps, Space, Tooltip } from "antd"
import { useEffect, useState } from "react"
import { FetchFn } from "../ADDITIONAL"
import { Iaffiliation, Itimetable, Tweight } from "../types"
import dayjs from 'dayjs';
import Loading from "./loading"
import { DeleteOutlined, DoubleRightOutlined, LoadingOutlined } from "@ant-design/icons"
import { useActions } from "../../store/hooks/useActions";

const AddNew: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)

    const [options1, setOptions1] = useState<SelectProps['options']>()
    const { errorMessage } = useActions()

    const [Date, setDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
    const [affiliation, setAffiliation] = useState<string>("")
    const [exercise, setExercise] = useState<{ [key: string]: SelectProps['options'] }>({})
    const [exercise1, setExercise1] = useState<string>("")
    const [weight, setWeight] = useState<Tweight[]>([])

    const [activities, setActivities] = useState<JSX.Element[]>([])

    const SendErrorMessage = (message: React.ReactNode | string, time: number = 1.5): void => {
        if (errorMessage) {
            errorMessage({
                args: {
                    content: message,
                },
                time: time
            })
        }
    }

    useEffect(() => {
        const answer3: JSX.Element[] = []
        weight.forEach(el3 => {
            if (el3.changes != "delete") {
                answer3.push(<Space key={el3.id}>
                    <InputNumber min={2} max={400} onChange={(value) => {
                        setWeight(prevData => {
                            const weight = value ? value : 0
                            const answer: Tweight[] = [...prevData]
                            answer.forEach(el => {
                                if (el.id === el3.id) {
                                    el.weight = weight
                                }
                            })
                            return answer
                        })
                    }}
                        addonAfter={"кг"} />
                    <DoubleRightOutlined />
                    <InputNumber min={1} max={100} onChange={(value) => {
                        setWeight(prevData => {
                            const repeat = value ? value : 0
                            const answer: Tweight[] = [...prevData]
                            answer.forEach(el => {
                                if (el.id === el3.id) {
                                    el.repeat = repeat
                                }
                            })
                            return answer
                        })
                    }} addonAfter={"раз"} />
                    <DeleteOutlined onClick={() => {
                        setWeight(prevData => {
                            const answer: Tweight[] = [...prevData]
                            answer.forEach(el => {
                                if (el.id === el3.id) {
                                    el.changes = "delete"
                                }
                            })
                            return answer
                        })
                    }} />
                </Space>)
            }
        })
        setActivities(answer3)
    }, [weight])

    // створює підходи
    const ExerciseDataNode = () => {
        const spec_id = Math.floor(Math.random() * 100)
        setWeight(prevData => ([...prevData, {
            id: spec_id,
            repeat: 0,
            weight: 0,
        }]))
    }



    const getNeededInfo = () => {
        FetchFn({
            type: "get_timetable"
        },
            (data: Itimetable[]) => {
                // const Items1: MenuProps['items'] = []
                // const checking: { [key: string]: [] } = {}


                // create list of combinations
                const exercises_array: Iaffiliation[] = []

                data.forEach(el => {

                    let change_I = true

                    el.changes?.forEach(changes => {
                        if (changes === "delete_exercise" || changes === "delete_affiliation") {
                            change_I = false
                        }
                    })

                    if (change_I) {
                        let A = true
                        exercises_array.forEach(el2 => {
                            if (el2.affiliation === el.affiliation) {
                                A = false
                                el2.elements.push({ position: el.position, exercise: el.exercise })
                            }

                        })
                        if (A) {
                            exercises_array.push({
                                affiliation: el.affiliation,
                                elements: [{ position: el.position, exercise: el.exercise }]
                            })
                        }

                    }

                })


                //створення options для комбінацій
                const Affiliations_options: SelectProps['options'] = exercises_array.map(el => {
                    const value: SelectProps['options'] = el.elements.map(el3 => ({
                        key: el3.exercise + Math.random(),
                        value: el3.exercise,
                        label: el3.exercise
                    }))
                    setExercise(prevData => ({
                        ...prevData,
                        [el.affiliation]: value
                    }))

                    return ({
                        key: el.affiliation + Math.random(),
                        value: el.affiliation,
                        label: el.affiliation,
                    })
                })
                setOptions1(Affiliations_options)
            }, setLoading, errorMessage)
    }

    const okFn = () => {
        const Affiliation = affiliation
        const Exercise = exercise1
        const date = Date

        if (Affiliation != "" && Exercise != "" && date != "") {
            const approach: Tweight[] = []
            let empty_I = true

            weight.forEach(el => {
                if (el.changes != "delete") {
                    approach.push(el)
                    if (el.repeat === 0 || el.weight === 0) {
                        empty_I = false
                    }
                }
            })
            if (empty_I) {
                FetchFn({
                    type: 'add_new_result',
                    affiliation: Affiliation,
                    exercise: Exercise,
                    date: date,
                    approach: JSON.stringify(approach)
                }, () => {
                    setOpenAdd(false)
                }, setLoading2, errorMessage)
            } else {
                SendErrorMessage("щось не введено в підходах")
            }
        } else {
            SendErrorMessage("не введено інформацію")
        }
    }

    return (<>
        <Modal
            title={false}
            open={openAdd}
            onCancel={() => setOpenAdd(false)}
            onOk={() => okFn()}
            okButtonProps={{ icon: loading2 ? <LoadingOutlined /> : null }}>
            {loading ? <Loading /> :
                <Space direction="vertical" style={{ width: "80%" }}>
                    <Select
                        style={{ width: "100%" }}
                        options={options1}
                        onChange={value => setAffiliation(value)}
                    />

                    <Select
                        style={{ width: "100%" }}
                        options={exercise[affiliation]}
                        onChange={value => setExercise1(value)} />

                    <DatePicker
                        onChange={(date, dateString) => {
                            setDate(dateString)
                            date ?? null//просто заглушка
                        }}
                        format={"YYYY-MM-DD"}
                        defaultValue={dayjs()}
                    />
                    Підходи
                    {activities}
                    <Space style={{display: "flex", justifyContent: "center"}}>
                        <Tooltip title={"додати підхід"}>
                            <Button onClick={() => {
                                ExerciseDataNode()
                            }}>+</Button>
                        </Tooltip>
                    </Space>
                </Space>}
        </Modal >
        <Space align="center" style={{width: "100%", display: "flex", justifyContent: "center"}}>
            <Tooltip title='додати'>
                <Button onClick={() => {
                    setOpenAdd(true)
                    getNeededInfo()
                    ExerciseDataNode()
                }}>+</Button>
        </Tooltip>
        </Space>
    </>
    )
}

export default AddNew