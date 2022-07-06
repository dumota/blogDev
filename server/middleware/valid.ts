import { Request, Response, NextFunction } from "express";

export const validRegister = async (req: Request, res: Response, next: NextFunction) => {
    const { name, account, password } = req.body;

    //validation for empty name
    if (!name) {
        return res.status(400).json({ msg: "Please add your name" })
    } else if (name.length > 20) {
        return res.status(400).json({ mag: "your name is up to 20 chars long" })
    }

    //verification to invalid email or phone with yours formats
    if (!account) {
        return res.status(400).json({ msg: "Please add your phone or Email" })
    } else if (!validPhone(account) && !validateEmail(account)) {
        return res.status(400).json({ mag: "Email or phone format is invalid" })
    }

    //Password verification tem que ser maior q 6
    if (password.length < 6) {
        return res.status(400).json({msg: "Password must be at least 6 chars."})
    }

    next();
}

function validPhone(phone: string) {
    const re = /^[+]/g
    return re.test(phone)
}

function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}