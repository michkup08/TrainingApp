import "../init";
import { useEffect, useState } from 'react'
import { AuthApi } from "../../service/AuthApi";

interface FormData {
    login: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    price: string;
    description: string;
    availability: string;
}

const RegisterPage = () => {
    const authApi = new AuthApi();
    const [formData, setFormData] = useState<FormData>({
        login: '',
        name: '',
        surname: '',
        email: '',
        password: '',
        price: '',
        description: '',
        availability: ''
    });
    const [isTrainer, setIsTrainer] = useState(false);
    const [formErrors, setFormErrors] = useState({
        emailIncorrect: false,
        passwordIncorrect: false,
        errorInfo: '',
    });
    const [success, setSuccess] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/;

    useEffect(() => {
        setFormErrors({
            ...formErrors,
            emailIncorrect: formData.email.length > 0 && !emailRegex.test(formData.email),
            passwordIncorrect: formData.password.length > 0 && !passwordRegex.test(formData.password),
        });
    }, [formData.email, formData.password]);

    const canRegister = (): boolean => {
        const { emailIncorrect, passwordIncorrect } = formErrors;
        const { email, password, login, name, surname,description, price, availability } = formData;

        return !(
            emailIncorrect ||
            !email ||
            passwordIncorrect ||
            !password ||
            !login ||
            !name ||
            !surname ||
            (isTrainer && (!description || !price || !availability))
        );
    }

    const handleRegister = async () => {
        if(canRegister())
        {
            const resp = await authApi.Register(
                formData.login,
                formData.password,
                formData.email,
                formData.name,
                formData.surname,
                isTrainer,
                formData.description,
                formData.price,
                formData.availability
            );
            if(resp.id)
            {
                sessionStorage.setItem('trainingAppAuthToken', resp.authToken!);
                window.location.href = '/';
            }
            else
            {
                setFormErrors({ ...formErrors, errorInfo: "Error during registration" });
                setSuccess(false);
            }
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className ="form">
            <div className="inputsWrapper" style={{marginTop: isTrainer ? '600px' : '70px'}}>
                {["Email", "Login", "Password", "Name", "Surname"].map((field) => (
                    <div key={field}>
                        <h3 className="authHeader">{field}</h3>
                        <input
                            className="authInput"
                            name={field.toLowerCase()}
                            placeholder={field}
                            type={field === "Password" ? "password" : "text"}
                            value = {formData[field.toLowerCase() as keyof FormData]}
                            onChange={handleInputChange}
                            style={{
                                borderWidth: (field === "Email" && formErrors.emailIncorrect) || (field === "Password" && formErrors.passwordIncorrect) ? '5px' : '1px',
                                borderColor: (field === "Email" && formErrors.emailIncorrect) || (field === "Password" && formErrors.passwordIncorrect) ? 'red' : '',
                            }}
                        />
                        <h5>{field === "Password" && formErrors.passwordIncorrect && 'Password should have big and small letter, number, special sign, and 8 sings'}</h5>
                    </div>
                ))}
                <h2 className="authHeader"><input
                    type="checkbox"
                    className="isTrainerCheckbox"
                    checked={isTrainer}
                    onChange={e => {
                        setIsTrainer(e.target.checked);
                    }}
                    /> I'm trainer</h2>
                {isTrainer &&
                    <>
                        <h3 className="authHeader">Description</h3>
                        <textarea 
                            rows={5}
                            className="authInput"
                            name="description" 
                            placeholder="Description"
                            onChange={handleInputChange}
                            style={{resize: 'none'}}/>
                        <h3 className="authHeader">Price</h3>
                        <input
                            className="authInput"
                            name="price" 
                            placeholder="Price"
                            onChange={handleInputChange}/>
                        <h3 className="authHeader">Availability</h3>
                        <input
                            className="authInput"
                            name="availability" 
                            placeholder="Availability"
                            onChange={handleInputChange}/>
                    </>
                }
                <h3 className="authHeader" id="errorInfo" style={{
                    color: success ? 'green' : 'blue'
                }}>{formErrors.errorInfo}</h3>
                <button 
                    className="authButton"
                    name = "register"
                    onClick={handleRegister}
                    style={{
                        backgroundColor: canRegister() ? 'green' : 'grey'}}
                        >Register</button>
            </div>
            
        </div>
    )
}

export default RegisterPage