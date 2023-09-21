import { TypedUseSelectorHook, useSelector } from "react-redux";
import { rootState } from "../reducers";
export const UseTypedSelector: TypedUseSelectorHook<rootState>=useSelector