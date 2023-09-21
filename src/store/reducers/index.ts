import { errorMessageReducer } from './errorMessageReducer';
import {combineReducers} from "redux"


export const rootReducer=combineReducers({
   errorMessage: errorMessageReducer,
})

export type rootState= ReturnType<typeof rootReducer>