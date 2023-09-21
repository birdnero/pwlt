import { message } from "antd"
import './diary.scss'
import Table from "./components/Table"
import { useLayoutEffect } from "react"
import { UseTypedSelector } from "../store/hooks/useTypedSelector"

const Diary: React.FC = () => {
    const { args, time } = UseTypedSelector(state => state.errorMessage)
    const [messageApi, contextHolder] = message.useMessage();

    useLayoutEffect(() => {
        messageApi.error(args, time)
    }, [args])


    return (<div className="container">
        {contextHolder}
        <div className="table_wrapper">
            <Table />
        </div>
    </div>)
}

export default Diary