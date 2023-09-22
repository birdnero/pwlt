export type TdaysOfWeek = "понеділок" | "вівторок" | "середа" | "четвер" | "п\'ятниця" | "субота"

export type Tchanges = "affiliation" | "exercise" | "delete" | "new"

export interface Itimetable {
    affiliation: string,
    position: number,
    exercise: string,
    changes?: Tchanges[],
    help_info?: any
}

type TchangesExercises = "changed" | "delete" | "new"
export interface Iexercises {
    id: number,
    exercise: string,
    changes?: TchangesExercises
}

export interface Iaffiliation {
    affiliation: string,
    elements: {
        position: number,
        exercise: string,
    }[]
}

export type Tweight = {
    id: number,
    weight: number,
    repeat: number,
    changes?: "delete"
}

export interface Iresult {
    affiliation: string,
    exercise: string,
    date: string
    repeats: number,
    weight: number
}