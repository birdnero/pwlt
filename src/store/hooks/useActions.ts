import { useDispatch } from "react-redux"
import {bindActionCreators} from 'redux'
import * as errorMessageActionCreators from "../actionCreators/errorMessageAction"

const ActionCreators={
    ...errorMessageActionCreators,
}

export const useActions = () =>{
    const dispatch=useDispatch()
    return bindActionCreators(ActionCreators, dispatch)
}