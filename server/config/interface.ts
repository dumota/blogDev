import { Document } from "mongoose"


export interface IUser extends Document{
    name : string,
    account: string,
    password: string,
    avatar: string,
    role: string,
    type: string,
    _doc: object
}

export interface INweUser{
    name: string,
    account: string,
    password: string
}

export interface IDecodedToken{
    id?: string,
    newUser?: INweUser,
    iat: number,
    exp: number
}