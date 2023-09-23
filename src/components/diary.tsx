import { message } from "antd"
import './diary.scss'
import Table from "./components/Table"
import { useEffect, useLayoutEffect, useState } from "react"
import { UseTypedSelector } from "../store/hooks/useTypedSelector"
import { FetchFn } from "./ADDITIONAL"
import { useNavigate } from "react-router-dom"
import { useActions } from "../store/hooks/useActions"
import Loading from "./components/loading"


const Diary: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { errorMessage } = useActions()
    const [effectAtFirst, SetEffectAtFirst] = useState(true)
    const { args, time } = UseTypedSelector(state => state.errorMessage)
    const [messageApi, contextHolder] = message.useMessage();
    const [atFirst, setAtFirst] = useState(false)

    useLayoutEffect(() => {
        if(atFirst){
            messageApi.error(args, time)
        } else {
            setAtFirst(true)
        }
    }, [args])

    useEffect(() => {
        if (effectAtFirst) {
            FetchFn({
                type: "check_token"
            }, (data: boolean) => {
                if (!data) {
                    navigate("/auth")
                }
            }, setLoading, errorMessage, true)

            SetEffectAtFirst(false)
        }
    }, [])


    return (<div className="container">
        {contextHolder}
        {loading ? <Loading /> : <div className="table_wrapper">
            <Table />
        </div>}
    </div>)
}

export default Diary