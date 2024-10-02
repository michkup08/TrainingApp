import { NavLink } from 'react-router-dom';
import '../css/Navbar.css';
import { useContext, useEffect } from 'react';
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
                {/* <NavLink to="/"><img src='/images/home.png' className='homeImage'/></NavLink> */}
                <NavLink to="/">Home</NavLink>
                {user.id && (
                    <>
                        <NavLink to="/trainingPlan">Training Plan</NavLink>
                        <NavLink to="/chats">Chats</NavLink>
                        <NavLink to="/trainers">Trainers</NavLink>
                    </>
                )}
                
            </div>
            <div className="nav-buttons">

                {fullName && <NavLink to='/profileEdition'>{fullName}</NavLink>}
                {!user.id ? (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink> 
                    </>
                    
                ) : (
                    <>
                        <a href='/login' onClick={resetContext}>Logout</a> 
                    </>
                )
                 
            
            }
                      
            </div>
        </nav>
    );
};

export default Navbar;
