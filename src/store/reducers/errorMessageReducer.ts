import { Istate, errorMessageAction, errorMessageActionTypes, initialState } from '../types/errorMessage';


export const errorMessageReducer=(state =initialState, action: errorMessageAction): Istate => {
    switch (action.type) {
        case errorMessageActionTypes.SET_MESSAGE:
            return {
                args: action.payload.args,
                time: action.payload.time
            }
            
        default:
            return state
    }
}