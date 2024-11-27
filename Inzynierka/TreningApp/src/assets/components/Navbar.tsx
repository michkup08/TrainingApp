import { NavLink } from 'react-router-dom';
import '../css/Navbar.css';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Navbar = () => {   
    const user = useContext(UserContext);
    const fullName = user.id ? user.name + ' ' + user.surname : '';

    const resetContext = () => {
        sessionStorage.setItem('trainingAppAuthToken', '');
    }

    return (
        <nav className="navbar">
            
            <div className="left">
                <NavLink to="/">Home</NavLink>
                {user.id!=undefined && user.id>0 && (
                    <>
                        <NavLink to="/trainingPlan">Training Plan</NavLink>
                        <NavLink to="/chats">Chats</NavLink>
                        <NavLink to="/trainers">Trainers</NavLink>
                        {user.role === 'ADMIN' && <NavLink to="/adminPanel">Admin Panel</NavLink>}
                    </>
                )}
            </div>
            <div className="nav-buttons">
                {user.id && user.id<=0 ? (
                        <>
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/register">Register</NavLink> 
                        </>
                    ) : (
                        <>
                            {fullName && <NavLink to='/profileEdition'>{fullName}</NavLink>}
                            <a href='/login' onClick={resetContext}>Logout</a> 
                        </>
                    )
                }  
            </div>
        </nav>
    );
};

export default Navbar;
