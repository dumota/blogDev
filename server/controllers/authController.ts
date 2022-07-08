import { Request, Response } from 'express';
import User from '../models/userModel'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateActiveToken, generateAccessToken, generateRefreshToken } from '../config/generateToken';
import sendEmail from '../config/sendMail';
import { validateEmail } from '../middleware/valid';
import { IDecodedToken, IUser } from '../config/interface';


const CLIENT_URL = `${process.env.BASE_URL}`;


const authController = {
    //FUNCTION TO REGISTER USERS
    register: async (req: Request, res: Response) => {
        try {
            const { name, account, password } = req.body;

            //const verficando se existe um usuario ja esxiste 
            const user = await User.findOne({ account });
            if (user) return res.status(400).json({ msg: 'Email or Phone already exists.' })

            //const encryptando seu password
            const passwordHash = await bcrypt.hash(password, 12)

            //novo usuario com os atributos necessarios para crialos (name:String, account:String'email or phone', password:String com hash)
            const newUser = ({
                name, account, password: passwordHash
            })

            //TOKEN DO JWT COM O USER CIRPTOGRAFADO
            const active_token = generateActiveToken({ newUser });

            //url da aplicação front end
            const url = `${CLIENT_URL}/active/${active_token}`

            //validação por email
            if (validateEmail(account)) {
                sendEmail(account, url, 'verify your email adress');
                //retorno de ok caso tudo esteja nos conformes
                return res.json({ msg: "Success! Please check your email." })
            }


        } catch (err) {
            return res.status(500).json({ msg: err })
        }
    },

    //FUNCTION TO ACTIVE THE USER , HERE GO SAVED THE USER IN THE DATABASE
    activeAccount: async (req: Request, res: Response) => {
        try {
            const { active_token } = req.body;
            const decoded = <IDecodedToken>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
            const { newUser } = decoded;

            if (!newUser) return res.status(400).json({ msg: "Invalid authenticantion" })

            const user = new User(newUser);
            await user.save();
            res.json({ msg: "Account has been activated" });


        } catch (err: any) {
            let errMsg;
            if (err.code === 11000) {
                errMsg = Object.keys(err.keyValue)[0] + "Already exist"


            }

            return res.status(500).json({ msg: err });
        }
    },

    //FUNCTION TO LOGIN AT APLICATION
    login: async (req: Request, res: Response) => {
        try {
            const { account, password } = req.body;
            const user = await User.findOne({ account });
            if (!user) return res.status(400).json({ msg: 'this account does not exists.' })

            //IF USER EXIST
            loginUser(user, password, res);

        } catch (err: any) {
            return res.status(500).json({ msg: err.message });

        }
    },

    //FUNCTION lOGOUT TO APLICATION
    logout: async (req: Request, res: Response) => {
        try {
            res.clearCookie('refreshtoken', { path: `/api/refresh_token` });
            return res.json({ msg: "Logged out!" })

        } catch (err: any) {
            return res.status(500).json({ msg: err.message })
        }
    },

    //FUNCTION TO REFRESH TOKEN
    refreshToken: async (req: Request, res: Response) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please login now!" })


            const decoded = <IDecodedToken>jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
            if (!decoded.id) return res.status(400).json({ msg: "Please login now!" })


            const user = await User.findById(decoded.id).select("-password");
            if (!user) return res.status(400).json({ msg: "this account does not exist." })
            console.log(user);

            const access_token = generateAccessToken({ id: user._id });


            res.json({ access_token });

        } catch (err: any) {
            return res.status(500).json({ msg: err });
        }
    }
}


const loginUser = async (user: IUser, password: string, res: Response) => {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." });

    const access_token = generateAccessToken({ id: user._id });
    const refresh_token = generateRefreshToken({ id: user._id });

    res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/refresh_token',
        maxAge: 30 * 24 * 60 * 60 * 1000 //30days
    })

    res.json({
        msg: 'Login Success',
        access_token,
        user: { ...user._doc, password: '' }
    })


}

export default authController;