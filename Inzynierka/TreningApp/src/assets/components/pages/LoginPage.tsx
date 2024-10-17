import { useState } from "react";
import "../init";
import "../../css/Auth.css"
import { AuthApi } from "../../service/AuthApi";

const LoginPage = () => {
    const authApi = new AuthApi();
    const [ success, setSuccess] = useState(false);
    const [ login, setLogin ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ errorInfo, setErrorInfo ] = useState('');

    const handleLogin = async() => {
        if(!(password =="" || login==""))
        {
            const resp = await authApi.Login(login, password)
            if(resp.id!=0)
            {
                sessionStorage.setItem('trainingAppAuthToken', resp.authToken!);
                setErrorInfo("Success login");
                setSuccess(true);
                window.location.href = '/';
            }
            else
            {
                setErrorInfo("Incorrect login or password");
                setSuccess(false);
            }
            
        }
    }

    return (
        <div className ="form">
            
            <h3 className="authHeader">Login</h3>
            <input 
                className="authInput"
                name="Login" 
                placeholder="Login"
                onChange={(e) => setLogin(e.target.value)}
                />
            <h3 className="authHeader">Password</h3>
            <input 
                className="authInput"
                name="password" 
                placeholder="Password"
                value={password} 
                type='password'
                onChange={(e) => setPassword(e.target.value)}/>
            
            <h3 
                className="authHeader"
                id="errorInfo" 
                style={{
                    color: success ? 'green' : 'rgb(219, 139, 130)'
                }}>{errorInfo}</h3>

            
            <button 
                className="authButton"
                name = "login"
                onClick={handleLogin}
                style={{
                    backgroundColor: (password =="" || login=="") ? 'grey' : 'green'}}
                    >Login</button>
        </div>
    )
}

export default LoginPage