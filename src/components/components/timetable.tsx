import React, { useEffect, useState } from 'react'
import '../diary.scss'
import Loading from './loading'
import { useActions } from '../../store/hooks/useActions'
import { Iaffiliation, Iexercises, IsaveRequest, Itimetable } from '../types'
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
                            return { id: el3.id, affiliation: el3.affiliation, position: el3.position, exercise: el3.exercise, changes: ["delete"] }
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
                                return { id: el2.id, affiliation: value.target.value, exercise: el2.exercise, position: el2.position, changes: ["affiliation"] }
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
                        style={{ width: "100%" }}
                        // штука що зберігає зміни при зміні вправи
                        onChange={value => {
                            setExercisesData(prevData => prevData.map(el3 => {
                                const changes = el3.changes ? el3.changes : []
                                if (el3.id === el4.id) {
                                    return { id: el3.id, affiliation: el3.affiliation, position: el3.position, exercise: value, changes: [...changes, "exercise"] }
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
                            const answer: Itimetable[] = []
                            prevData.forEach(el3 => {
                                // знаходження елементів з потрібної комбінації
                                if (el.affiliation === el3.affiliation) {
                                    // пошук потрібної позиції
                                    if (el4.position === el3.position) {
                                        if (el3.changes) {
                                            answer.push({ id: el3.id, affiliation: el3.affiliation, position: el3.position, exercise: el3.exercise, changes: [...el3.changes, 'delete'] })
                                        } else {
                                            answer.push({ id: el3.id, affiliation: el3.affiliation, position: el3.position, exercise: el3.exercise, changes: ['delete'] })
                                        }
                                        // зміна позицій всіх наступних елементів
                                    } else if (deleted_I < el3.position) {
                                            answer.push({ id: el3.id, affiliation: el3.affiliation, position: el3.position - 1, exercise: el3.exercise, changes: el3.changes })
                                    } else {
                                        answer.push(el3)
                                    }
                                } else {
                                    answer.push(el3)
                                }
                            })
                            return answer

                        })} />
                </Space>)
            })}
            {/* кнопка для додавання вправи */}
            {el.elements.length < 9 ?
                <Button
                    type='text'
                    onClick={() => setExercisesData(prevData => {
                        let position3: number = el.elements.reduce((acc, el2) => (acc > el2.position ? acc : el2.position), 0)
                        position3++
                        return ([...prevData, { id: Math.floor(Math.random() * 10000), affiliation: el.affiliation, position: position3, exercise: "", changes: ["new"] }])
                    })}>+</Button> : <></>}
        </div>))

        // складання фінального вигляду таблиці комбінацій
        return (<>
            <Space style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", justifyContent: "start", alignItems: "start", gap: "10%" }}>
                {table}
            </Space>
            {/* кнопка для додавання комбінації */}
            <Button
                onClick={() => {
                    setExercisesData(prevData => ([...prevData, { id: Math.floor(Math.random() * 10000), affiliation: "#" + Math.floor(Math.random() * 10000), exercise: "", position: 1, changes: ['new'] }]))
                    console.log(exercisesData)
                }
                }>
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
                if (changes === "delete") {
                    change_I = false
                }
            })

            if (change_I) {
                let A = true
                exercises_array.forEach(el2 => {
                    if (el2.affiliation === el.affiliation) {
                        A = false
                        el2.elements.push({ id: el.id, position: el.position, exercise: el.exercise })
                    }

                })
                if (A) {
                    exercises_array.push({
                        affiliation: el.affiliation,
                        elements: [{ id: el.id, position: el.position, exercise: el.exercise }]
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

        const insert_data: IsaveRequest[] = []
        const update_affiliation_data: { id: number, new_affiliation: string }[] = []
        const update_exercise_data: IsaveRequest[] = []
        const delete_exercise_data: number[] = []
        console.log(exercisesData)
        //перевірка на пустоту вправ та видалення повторюваних елементів
        let empty_exercises_I = true
        exercisesData.forEach(el1 => {
            if (el1.exercise === "") {
                empty_exercises_I = false
                console.log(el1)
                if (el1.changes && el1.changes[0] === "new") {
                    el1.changes.forEach(el => {
                        if (el === "delete") {
                            empty_exercises_I = true
                        }
                    })
                }
            }
        })

        if (empty_exercises_I) {

            // сортування по змінах
            exercisesData.forEach(el => {
                const mod = el.changes ? el.changes : []

                if (mod[0] === "new") {
                    let del_I = true
                    mod.forEach(el3 => {
                        if (el3 === "delete") {
                            del_I = false
                        }
                    })
                    if (del_I) {
                        insert_data.push({ affiliation: el.affiliation, position: el.position, exercise: el.exercise })
                    }
                } else {
                    mod.forEach(el3 => {
                        if (el3 === "delete") {
                            delete_exercise_data.push(el.id)
                        }
                        if (el3 === "affiliation") {
                            update_affiliation_data.push({ id: el.id, new_affiliation: el.affiliation })
                        }
                        if (el3 === "exercise") {
                            update_exercise_data.push({ id: el.id, affiliation: el.affiliation, position: el.position, exercise: el.exercise })
                        }
                    })
                }

            })
            // запит з передачею всіх змін
            FetchFn({
                type: "update_timetable",
                insert: JSON.stringify(insert_data),
                update_affiliation: JSON.stringify(update_affiliation_data),
                update_exercise: JSON.stringify(update_exercise_data),
                delete_exercise: JSON.stringify(delete_exercise_data)
            }, () => {
                setOpenTimeTable(false)
            }, setLoading2, errorMessage)

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