import { useState } from "react";
import { inputChange } from "../../utils/Typescript";


const LoginPass = ()=>{
    const initialState = {account: '', password: ''};
    const [userLogin, setUserLogin] = useState(initialState);
    const {account, password} = userLogin;

    const handleChangeInput = (e: inputChange)=>{
        const {value, name} = e.target;
        setUserLogin({...userLogin, [name]:value})
    }

    return(
        <form>
            <div className="form_group">
                <label htmlFor="account">Email</label>
                <input type="text" className="form-control" id="account" name="account" value={account} onChange={handleChangeInput}/>
            </div>
        </form>
    )
}

export default LoginPass;