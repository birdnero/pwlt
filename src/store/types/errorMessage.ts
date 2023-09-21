import { JointContent } from "antd/es/message/interface";

export enum errorMessageActionTypes {
    SET_MESSAGE = "SET_MESSAGE"
}

export interface Ipayload{
    args: JointContent
    time: number
}

interface setErrorMessage {
    type: errorMessageActionTypes.SET_MESSAGE,
    payload: Ipayload 
}



export type errorMessageAction = setErrorMessage
export interface Istate {
    args: JointContent,
    time: number
}

export const initialState: Istate = {
    args: {
        content: "",
        style: {display: "none"}
    },
    time: 1
}
