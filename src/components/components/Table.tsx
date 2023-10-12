import { ReactNode, useEffect, useState } from 'react'
import '../diary.scss'
import { FetchFn } from '../ADDITIONAL'
import { Iresult } from '../types'
import { useActions } from '../../store/hooks/useActions'
import Settings from './settings'
import Loading from './loading'
import { Button, Modal, Space, Tooltip, Typography } from 'antd'
import { SettingTwoTone } from '@ant-design/icons'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    ChartData,
    BubbleDataPoint,
    Point,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs'
import styles from '../styles'
import AddNew from './addNew'


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip
);

const Table: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [FT, setFT] = useState(true)
    const [openSettings, setOpenSettings] = useState(false)
    const { errorMessage } = useActions()
    const [Chartdata, setChartdata] = useState<ChartData<"line", (number | [number, number] | Point | BubbleDataPoint | null)[], unknown>>()
    const [exercises, setExercises] = useState<ReactNode[]>([])
    const [naming, setNaming] = useState('')


    useEffect(() => {
        if (FT) {
            FetchFn({ type: "get_results" }, (data: Iresult[]) => {
                const data3: Iresult[] = data.map(date => {
                    let answer = { ...date }
                    answer.date = dayjs(date.date).format('MM.DD')
                    return answer
                })
                data3.sort((a, b) => {
                    const dateA = dayjs(a.date);
                    const dateB = dayjs(b.date);
                    return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
                });

                setExercises(() => {
                    const answer1: string[] = []
                    data3.forEach(el => {
                        let exercise_I = true
                        answer1.forEach(el3 => {
                            if (el3 === el.exercise) {
                                exercise_I = false
                            }
                        })
                        if (exercise_I) {
                            answer1.push(el.exercise)
                        }
                    })

                    const first_el = answer1[0]
                    const labels: string[] = []
                    const weight: number[] = []
                    data3.forEach(el3 => {
                        if (el3.exercise === first_el) {
                            setNaming(first_el)
                            labels.push(el3.date)
                            weight.push(el3.weight)
                        }
                    })
                    setChartdata({
                        labels: labels,
                        datasets: [
                            {
                                backgroundColor: undefined,
                                label: "кг",
                                data: weight,
                                pointBackgroundColor: styles.$blue,
                                tension: 0.333,
                            }
                        ],

                    })

                    return answer1.map(el => (<Button onClick={() => {
                        const labels: string[] = []
                        const weight: number[] = []
                        data3.forEach(el3 => {
                            if (el3.exercise === el) {
                                setNaming(el)
                                labels.push(el3.date)
                                weight.push(el3.weight)
                            }
                        })
                        setChartdata({
                            labels: labels,
                            datasets: [
                                {
                                    backgroundColor: undefined,
                                    label: "кг",
                                    data: weight,
                                    pointBackgroundColor: styles.$blue,
                                    tension: 0.333,
                                }
                            ],

                        })
                    }}>
                        {el}
                    </Button>))
                })
            }, setLoading, errorMessage)
            setFT(false)
        }
    }, [])

    return (<>
        <Modal
            title="Налаштування"
            open={openSettings}
            onCancel={() => setOpenSettings(false)}
            onOk={() => setOpenSettings(false)}>
            <Settings />
        </Modal>

        {loading ? <Loading /> : <Space direction='vertical' style={{ width: "100dvw" }}>
            <AddNew />
            <Space style={{ position: "absolute", top: "2.5%", right: "2.5%" }}>
                <Tooltip title='налаштування'>
                    <Button onClick={() => setOpenSettings(true)} type="link" icon={<SettingTwoTone />} />
                </Tooltip>
            </Space>
            <Space style={{
                width: "95dvw",
                marginRight: "4dvw", 
                marginLeft: "1dvh",
                display: "flex",
                flexWrap: "wrap"

            }}>{exercises}</Space>
            {Chartdata ? <div style={{ width: "95dvw", marginRight: "4dvw", marginLeft: "1dvh" }}>
                
                    <Typography.Title level={2} style={{ color: styles.$blue }} >{naming}</Typography.Title>
                
                <Line options={{
                    backgroundColor: "#00000000",
                    scales: {
                        y: {
                            ticks: {
                                callback(tickValue) {
                                    return tickValue + " кг"
                                },
                            },
                            beginAtZero: true,
                            grid: {
                                drawTicks: false,
                                drawOnChartArea: true,
                            }
                        },
                        x: {
                            ticks: {
                                maxTicksLimit: 10,
                                padding: 15
                            },
                            grid: {
                                drawTicks: false,
                                drawOnChartArea: false,
                            },
                        }
                    },
                }} data={Chartdata ? Chartdata : {
                    labels: [],
                    datasets: [],
                }} />
            </div> : ""}
        </Space>}
    </>)
}

export default Table