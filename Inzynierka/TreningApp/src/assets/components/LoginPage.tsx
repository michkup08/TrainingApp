import { useState } from "react";
import "./init";
import { AuthApi } from "../service/AuthApi";

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
        <div id ="RegisterForm">
            
            <h3>Login</h3>
            <input 
                name="Login" 
                placeholder="Login"
                onChange={(e) => setLogin(e.target.value)}
                />
            <h3>Password</h3>
            <input 
                name="password" 
                placeholder="Password"
                value={password} 
                type='password'
                onChange={(e) => setPassword(e.target.value)}/>
            
            <h3 id="errorInfo" style={{
                color: success ? 'green' : 'blue'
            }}>{errorInfo}</h3>

            
            <button 
                name = "login"
                onClick={handleLogin}
                style={{
                    backgroundColor: (password =="" || login=="") ? 'grey' : 'green'}}
                    >Login</button>
        </div>
    )
}

export default LoginPage