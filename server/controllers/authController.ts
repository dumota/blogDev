import { Request, Response } from 'express';
import User from '../models/userModel'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateActiveToken } from '../config/generateToken';


const authController = {
    register: async (req: Request, res: Response) => {
        try {
            const { name, account, password } = req.body;

            //const verficando se existe um usuario ja esxiste 
            const user = await User.findOne({account});
            if(user) return res.status(400).json({msg: 'Email or Phone already exists.'})

            //const encryptando seu password
            const passwordHash = await bcrypt.hash(password, 12)

            //novo usuario com os atributos necessarios para crialos (name:String, account:String'email or phone', password:String com hash)
            const newUser =({
                name , account, password: passwordHash
            })

            //TOKEN DO JWT COM O USER CIRPTOGRAFADO
            const active_token = generateActiveToken({newUser});

            //retorno de ok caso tudo esteja nos conformes
            res.json({
                status: 'OK',
                msg: 'Register successfully', 
                data: newUser, active_token
            })

        } catch (err) {
            return res.status(500).json({ msg: err })
        }
    }
}

export default authController;