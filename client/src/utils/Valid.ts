import { IUserRegister } from "./Typescript";

export const validRegister = (data: IUserRegister) => {
    const { name, account, password, cf_password } = data;
    const errors: string[] = [];

    //validation for empty name
    if (!name) {
        errors.push("Please add your name");
    } else if (name.length > 20) {
        errors.push( "your name is up to 20 chars long")
    }

    //verification to invalid email or phone with yours formats
    if (!account) {
        errors.push("Please add your Email");
    } else if (!validPhone(account) && !validateEmail(account)) {
        errors.push("Email format is incorrect");
    }

    //Password verification tem que ser maior q 6
    if (password.length < 6) {
        errors.push("Password must be at least 6 chars");
    }else if (password !== cf_password) {
        errors.push("Confirm Password did not match");
    }

    return{
        errMsg: errors,
        errLength: errors.length
    }
}



//function of the validation to phone (format)
export function validPhone(phone: string) {
    const re = /^[+]/g
    return re.test(phone)
}

//function of the validation to email (format)
export function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}