import { Ipayload, errorMessageAction, errorMessageActionTypes } from "../types/errorMessage";

export const errorMessage=(payload: Ipayload): errorMessageAction=>({
    type: errorMessageActionTypes.SET_MESSAGE,
    payload: payload
})
