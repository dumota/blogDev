
import { IAlert } from "../../utils/Typescript";
export const ALERT = 'ALERT';

export interface IAlertType{
    type: typeof ALERT,
    payload: IAlert
}