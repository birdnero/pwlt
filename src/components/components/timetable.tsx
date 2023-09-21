import React, { useEffect, useState } from 'react'
import '../diary.scss'
import Loading from './loading'
import { useActions } from '../../store/hooks/useActions'
import { Iaffiliation, Iexercises, Itimetable } from '../types'
import { Button, Input, Modal, Select, SelectProps, Space } from 'antd'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { FetchFn } from '../ADDITIONAL'

const Timetable: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [exercisesData, setExercisesData] = useState<Itimetable[]>([])
    const [exercises, setExercises] = useState<JSX.Element>(<></>)
    const { errorMessage } = useActions()
    const [openTimetable, setOpenTimeTable] = useState(false)
    const [options, setOptions] = useState<SelectProps['options']>()


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

    // компонента яка і є таблицею комбінацій
    const ExercisesFn: React.FC<{ ComponentData: Iaffiliation[] }> = ({ ComponentData }) => {

        // створення масиву комбінацій
        const table = ComponentData.map(el => (<div key={el.affiliation}>
            <Input
                // кнопка для видалення комбінації
                addonAfter={<DeleteOutlined onClick={() => {
                    setExercisesData(prevData => prevData.map(el3 => {
                        if (el.affiliation === el3.affiliation) {
                            return { affiliation: el3.affiliation, position: el3.position, exercise: el3.exercise, changes: ["delete_affiliation"] }
                        } else {
                            return el3
                        }
                    }))
                }} />}
                bordered={false}
                // штука що зберігає зміни при зміні назви комбінації
                onBlur={value => {
                    let affiliation_I = true
                    ComponentData.forEach(el3 => {
                        if (el3.affiliation != el.affiliation && el3.affiliation === value.target.value) {
                            affiliation_I = false
                            SendErrorMessage("комбінація з цією назвою вже існує")
                        }
                    })
                    if (affiliation_I) {
                        setExercisesData(prevData => prevData.map(el2 => {
                            if (el.affiliation === el2.affiliation) {
                                return { affiliation: value.target.value, exercise: el2.exercise, position: el2.position, changes: ["affiliation"], help_info: el2.affiliation }
                            } else {
                                return el2
                            }
                        }))
                    } else {
                        setExercisesData(prevData => ([...prevData]))
                    }
                }}
                defaultValue={el.affiliation} />
            {/* вміст комбінацій */}
            {el.elements.map(el4 => {
                const spec_options: SelectProps['options'] = []
                options?.forEach(el5 => {
                    let exercise_I = true
                    el.elements.forEach(el6 => {
                        if (el5.value === el6.exercise) {
                            exercise_I = false
                        }
                    })
                    if (exercise_I) {
                        spec_options.push(el5)
                    }
                })
                return (<Space style={{ display: "grid", gridTemplateColumns: "1fr 9fr 2fr" }} key={el4.position + Math.random()}>
                    <div>{el4.position}</div>
                    <Select
                        style={{width: "100%"}}
                        // штука що зберігає зміни при зміні вправи
                        onChange={value => {
                            setExercisesData(prevData => prevData.map(el3 => {
                                const changes = el3.changes ? el3.changes : []
                                if (el4.position === el3.position && el.affiliation === el3.affiliation) {
                                    return { affiliation: el3.affiliation, position: el3.position, exercise: value, changes: [...changes, "exercise"] }
                                } else {
                                    return el3
                                }
                            }))
                        }}
                        defaultValue={el4.exercise}
                        options={spec_options}
                    />
                    {/* кнопка для видалення вправи */}
                    <DeleteOutlined
                        onClick={() => setExercisesData(prevData => {
                            let deleted_I = el4.position
                            return prevData.map(el3 => {
                                // знаходження елементів з аотрібної комбінації
                                if (el.affiliation === el3.affiliation) {
                                    // пошук потрібної позиції
                                    if (el4.position === el3.position) {
                                        deleted_I = el3.position
                                        return { affiliation: el3.affiliation, position: el3.position, exercise: el3.exercise, changes: ["delete_exercise"] }
                                        // зміна позицій всіх наступних елементів
                                    } else if (deleted_I < el3.position) {
                                        deleted_I = el3.position
                                        const changes = el3.changes ? el3.changes : []
                                        return { affiliation: el3.affiliation, position: el3.position - 1, exercise: el3.exercise, changes: [...changes, 'exercise'] }
                                    } else {
                                        return el3
                                    }
                                } else {
                                    return el3
                                }
                            })

                        })} />
                </Space>)
            })}
            {/* кнопка для додавання вправи */}
            {el.elements.length < 9 ?
                <Button
                    type='text'
                    onClick={() => setExercisesData(prevData => ([...prevData, { affiliation: el.affiliation, position: el.elements.length + 1, exercise: "", changes: ["new"] }]))}>+</Button> : <></>}
        </div>))

        // складання фінального вигляду таблиці комбінацій
        return (<>
            <Space style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", justifyContent: "start", alignItems: "start", gap: "10%" }}>
                {table}
            </Space>
            {/* кнопка для додавання комбінації */}
            <Button
                onClick={() => setExercisesData(prevData => ([...prevData, { affiliation: "#" + Math.floor(Math.random() * 10000), exercise: "", position: 1, changes: ['new'] }]))}>
                додати
            </Button>
        </>)
    }

    const CreateAffiledList = () => {
        // create list of combinations
        const exercises_array: Iaffiliation[] = []

        exercisesData.forEach(el => {

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
        return exercises_array
    }

    // при зміні даних в exercisesData перерендирить exercises
    useEffect(() => {

        const exercises_array = CreateAffiledList()

        //впихає в компоненту таблицю
        setExercises(<ExercisesFn ComponentData={exercises_array} />)

    }, [exercisesData])


    //отримує і створює options & exercisesData    використовується в getTimetable()
    const DataAPI = (data: { timetable: Itimetable[], exercises: Iexercises[] }): void => {
        const Exercises: SelectProps['options'] = data.exercises.map((el, index) => ({
            key: el.exercise + index,
            value: el.exercise,
            label: el.exercise,
        }))
        setExercisesData(data.timetable)
        setOptions(Exercises)
    }


    const setNewValues = () => {

        const insert_data: Iaffiliation[] = []
        const update_affiliation_data: { old_affiliation: string, new_affiliation: string }[] = []
        const update_exercise_data: Itimetable[] = []
        const delete_affiliation_data: string[] = []
        const delete_exercise_data: Itimetable[] = []

        const list_of_needed: Itimetable[] = [...exercisesData]
        //перевірка на пустоту вправ та видалення повторюваних елементів
        list_of_needed.forEach((el1, index1) => {
            list_of_needed.forEach((el2, index2) => {
                if (el1.position === el2.position && el1.affiliation === el2.affiliation) {
                    list_of_needed.splice((index1 < index2 ? index1 : index2), 1)
                }
            })
        })
        let empty_exercises_I = true
        list_of_needed.forEach(el1 => {
            if (el1.exercise === "") {
                empty_exercises_I = false
            }
        })

        if (empty_exercises_I) {

            // сортування по змінах
            list_of_needed.forEach(el => {
                el.changes?.forEach(changes => {

                    switch (changes) {
                        case "new":
                            let A = true
                            insert_data.forEach(el2 => {
                                if (el2.affiliation === el.affiliation) {
                                    A = false
                                    el2.elements.push({ position: el.position, exercise: el.exercise })
                                }

                            })
                            if (A) {
                                insert_data.push({
                                    affiliation: el.affiliation,
                                    elements: [{ position: el.position, exercise: el.exercise }]
                                })
                            }
                            break;
                        case "affiliation":
                            update_affiliation_data.push({ old_affiliation: el.help_info, new_affiliation: el.affiliation })
                            break;
                        case "exercise":
                            update_exercise_data.push({ affiliation: el.affiliation, position: el.position, exercise: el.exercise })
                            break;
                        case "delete_affiliation":
                            delete_affiliation_data.push(el.affiliation)
                            break;
                        case "delete_exercise":
                            delete_exercise_data.push({ affiliation: el.affiliation, position: el.position, exercise: el.exercise })
                            break;
                        default:
                            break;
                    }
                })
                // запит з передачею всіх змін
                FetchFn({
                    type: "update_timetable",
                    insert: JSON.stringify(insert_data),
                    update_affiliation: JSON.stringify(update_affiliation_data),
                    update_exercise: JSON.stringify(update_exercise_data),
                    delete_affiliation: JSON.stringify(delete_affiliation_data),
                    delete_exercise: JSON.stringify(delete_exercise_data)
                }, () => {
                    setOpenTimeTable(false)
                }, setLoading2, errorMessage)

            })

        } else {
            SendErrorMessage("пуста вправа")
        }

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
            okButtonProps={{ icon: loading2 ? <LoadingOutlined /> : null }}>
            {loading ? <Loading /> :
                <Space align='center' direction='vertical'>
                    {exercises}
                </Space>}
        </Modal>
        <Button onClick={() => {
            FetchFn({ type: "get_timetable", special_type: "get_exercises" }, DataAPI, setLoading, errorMessage)
            setOpenTimeTable(true)
        }} >комбінації</Button>
    </>)

}

export default Timetable