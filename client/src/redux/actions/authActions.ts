import { AUTH, IAuthType } from "../types/authTypes";
import { ALERT, IAlertType } from "../types/alertType";
import { IUserLogin } from "../../utils/Typescript";
import { postAPI } from "../../utils/FetchData";
import { Dispatch } from 'redux'

export const login = (userLogin: IUserLogin) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
        dispatch({ type: ALERT, payload: { loading: true } })

        const res = await postAPI('login', userLogin);

        dispatch({
            type: AUTH,
            payload: {
                token: res.data.access_token,
                user: res.data.user

            }
        })

        dispatch({ type: ALERT, payload: { success: "Login Success!" } })
    } catch (err: any) {
        dispatch({ type: ALERT, payload: { errors: err.response.data.msg } })
       
    }

}