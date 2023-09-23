import { Ipayload, errorMessageAction } from "../store/types/errorMessage";
import { TdaysOfWeek } from "./types";

export const url = 'https://nero-host.000webhostapp.com'

export const days: TdaysOfWeek[] = ["понеділок", "вівторок", "середа", "четвер", "п\'ятниця"]

export const FetchFn = (requestArray: { [key: string]: any },
    Function?: (data: any) => any,
    setLoading?: ((value: React.SetStateAction<boolean>) => void) | null,
    errorMessage?: (payload: Ipayload) => errorMessageAction, cookie: boolean= false ) => {
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

    const entries = Object.entries(requestArray);
    const requestData = new FormData()
    entries.forEach(el => {
        requestData.append(el[0], el[1])
    })
    setLoading ? setLoading(true) : null
    return fetch(url, cookie? {
        method: 'POST',
        body: requestData,
        credentials: "include",
    } : {
        method: 'POST',
        body: requestData,
    })
        .then(response => response.text())
        .then(response => JSON.parse(response))
        .then(response => {
            setLoading ? setLoading(false) : null
            if (response.error == "") {
                const data = response.data
                if (Function) {
                    Function(data)
                }

            } else {
                SendErrorMessage ? SendErrorMessage("виникла помилка, спробуйте ще раз") : null
            }
        })
        .catch(error => {
            console.log(error)
        })
}

