export type TLoginAuth = {
    email: string,
    password: string
}


export type TRegisterAuth = {
    email: string,
    password: string
}

export type TUpdateAuthMe = {
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    city: string
}

export type TPagination = {
    page: number,
    limit: number,
}
