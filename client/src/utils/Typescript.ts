import { ChangeEvent } from "react"

export type inputChange = ChangeEvent<HTMLInputElement>


export interface IParams{
    page: string,
    slug: string
}