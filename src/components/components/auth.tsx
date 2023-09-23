import { Input, InputRef, Space, message, Typography } from "antd"
import { FetchFn } from "../ADDITIONAL"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useActions } from "../../store/hooks/useActions"
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons"
import { UseTypedSelector } from "../../store/hooks/useTypedSelector"



const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { errorMessage } = useActions()
    const [input, setInput] = useState<string>("")
    const inputRef = useRef<InputRef>(null)
    const { args, time } = UseTypedSelector(state => state.errorMessage)
    const [messageApi, contextHolder] = message.useMessage();

    useLayoutEffect(() => {
        messageApi.error(args, time)
    }, [args])

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

    const {Title} = Typography

    useEffect(()=>{
        if(inputRef.current){
            inputRef.current.focus()
        }
    }, [])

    function CheckAuth() {
        if (input != "") {
            FetchFn({
                type: "auth",
                password: input
            }, (data: boolean) => {
                if (data) {
                    navigate("/")
                } else {
                    SendErrorMessage("неправильний пароль")
                }
            }, setLoading, errorMessage, true)
        } else {
            SendErrorMessage("пусте поле")
        }
    }

    return (<Space size={"large"} direction="vertical" style={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }}>
        
        {contextHolder}
        <Title>Вхід В PWLT ing</Title>
        <Input
            ref={inputRef}
            addonAfter={loading ? <LoadingOutlined /> : <CheckOutlined onClick={() => CheckAuth()} />}
            onChange={value => setInput(value.target.value)}
            onKeyDown={key => {
                if (key.key === "Enter") {
                    CheckAuth()
                }
            }}
            value={input} />
    </Space>)
}
export default Auth