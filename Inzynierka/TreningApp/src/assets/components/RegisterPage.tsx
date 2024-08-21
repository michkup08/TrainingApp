import "./init";
import { useState } from 'react'
import { AuthApi } from "../service/AuthApi";


const RegisterPage = () => {
    const authApi = new AuthApi();
    const [ success, setSuccess] = useState(false);
    const [ login, setLogin ] = useState('');
    const [ name, setName ] = useState('');
    const [ surname, setSurname ] = useState('');
    const [ errorInfo, setErrorInfo ] = useState('');

    const [email, setEmail] = useState('');
    const [ emailIncorrect, setEmailIncorrect ] = useState(false);

    const [ password, setPassword ] = useState('');
    const [ passwordIncorrect, setPasswordIncorrect ] = useState(false);
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/;

    const handleEmailChange = (event) =>{
        setEmail(event.target.value);
        setEmailIncorrect(false);

        if(!emailRegex.test(event.target.value) && event.target.value != "")
        {
            setEmailIncorrect(true);
        }
    }

    const handlePasswordChange = (event) =>{
        setPassword(event.target.value);
        setPasswordIncorrect(false);
        if(!passwordRegex.test(event.target.value) && event.target.value != "")
        {
            setPasswordIncorrect(true);
        }
    }

    const handleRegister = async () => {
        if(!(emailIncorrect || email == "" || passwordIncorrect || password =="" || login=="" || name=="" || surname=="" ))
        {
            
            const resp = await authApi.Register( login, password, email, name, surname );
            if(resp.id)
            {
                console.log(resp);
                sessionStorage.setItem('trainingAppAuthToken', resp.authToken!);
                window.location.href = '/';
            }
            else
            {
                setErrorInfo("Rejestracja nie powiodła się");
                setSuccess(false);
            }
        }
    }

    return (
        <div id ="RegisterForm">
            <h3>Email</h3>
            <input 
                name="Email" 
                placeholder="Email" 
                value={email} 
                onChange={handleEmailChange} 
                style={{
                    borderWidth: emailIncorrect ? '3px' : '1px',
                    borderColor: emailIncorrect ? 'red':''}}/>
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
                onChange={handlePasswordChange} 
                style={{
                    borderWidth: passwordIncorrect ? '3px' : '1px',
                    borderColor: passwordIncorrect ? 'red':''}}/>
            <h3>Name</h3>
            <input 
                name="Name" 
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}/>
            <h3>Surname</h3>
            <input 
                name="Surname" 
                placeholder="Surname"
                onChange={(e) => setSurname(e.target.value)}/>
            <h3 id="errorInfo" style={{
                color: success ? 'green' : 'blue'
            }}>{errorInfo}</h3>
            <button 
                name = "register"
                onClick={handleRegister}
                style={{
                    backgroundColor: (emailIncorrect || email == "" || passwordIncorrect || password =="" || login=="" || name=="" || surname=="" ) ? 'grey' : 'green'}}
                    >Register</button>
        </div>
    )
}

export default RegisterPage