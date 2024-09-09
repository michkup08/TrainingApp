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
                {/* <NavLink to="/"><img src='/images/home.png' className='homeImage'/></NavLink> */}
                <NavLink to="/">Home</NavLink>
                {user.id != 0 && (
                    <>
                        <NavLink to="/trainingPlan">Training Plan</NavLink>
                        <NavLink to="/chats">Chats</NavLink>
                    </>
                )}
                
            </div>
            <div className="nav-buttons">

                <NavLink to='/'>{fullName}</NavLink>
                {user.id === 0 || user.id === undefined ? (
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
