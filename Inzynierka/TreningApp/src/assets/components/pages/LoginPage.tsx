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
    const cantLogin = password === "" || login === "" ;

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className ="form">
            
            <h3 className="authHeader">Login</h3>
            <input 
                className="authInput"
                name="Login" 
                placeholder="Login"
                onChange={(e) => setLogin(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key === 'Enter') {
                        handleLogin();
                    }
                }}
                />
            <h3 className="authHeader">Password</h3>
            <input 
                className="authInput"
                name="password" 
                placeholder="Password"
                value={password} 
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                />
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
                disabled = {cantLogin}
                style={{
                    backgroundColor: (cantLogin) ? 'grey' : 'green'}}
                    >Login</button>
        </div>
    )
}

export default LoginPage