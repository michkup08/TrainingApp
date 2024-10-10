import HomePage from './assets/components/HomePage.tsx'
import { Route, Routes, useLocation } from 'react-router-dom';
import ChatsPage from './assets/components/ChatsPage.tsx';
import LoginPage from './assets/components/LoginPage.tsx';
import RegisterPage from './assets/components/RegisterPage.tsx';
import MainTrainingPlan from './assets/components/MainTrainingPlanPage.tsx';
import EditTrainingPlan from './assets/components/EditTrainingPlan.tsx';
import MyPlansPage from './assets/components/MyPlansPage.tsx';
import ProfileEdition from './assets/components/ProfileEdition.tsx';
import TrainersList from './assets/components/TrainersPage.tsx';

import { AnimatePresence } from 'framer-motion';
import MoveSideways from './assets/components/motion/MoveSideways.tsx';
import { useEffect, useRef} from 'react';

const routeValues: Record<string, number> = {
    '/': 0,
    '/trainingPlan': 1,
    '/trainingPlan/edit': 3,
    '/trainingPlan/usersPlans': 2,
    '/profileEdition': 6,
    '/chats': 4,
    '/trainers': 5,
    '/login': 7,
    '/register': 8,
  };

const AnimatedRoutes = () => {
    const location = useLocation();
    const prevPathValue = useRef(routeValues[location.pathname]);

    const getDirection = () => {
        const currentValue = routeValues[location.pathname];
        const direction = currentValue > prevPathValue.current ? 'right' : 'left';
        return direction;
    };

    useEffect(() => {
        prevPathValue.current = routeValues[location.pathname];
    }, [location]);

    return (
    <div>
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route path= '/' element= {<MoveSideways direction={getDirection()}><HomePage/></MoveSideways>} />
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
                <Route path="/profileEdition" element={<MoveSideways direction={getDirection()}><ProfileEdition/></MoveSideways>}/>
                <Route path="/chats" element={<MoveSideways direction={getDirection()}><ChatsPage/></MoveSideways>}/>
                <Route path="/trainers" element={<MoveSideways direction={getDirection()}><TrainersList/></MoveSideways>}/>
                <Route path='/trainingPlan' element={<MoveSideways direction={getDirection()}><MainTrainingPlan/></MoveSideways>}/>
                <Route path='/trainingPlan/edit' element={<MoveSideways direction={getDirection()}><EditTrainingPlan/></MoveSideways>}/>
                <Route path='/trainingPlan/usersPlans' element={<MoveSideways direction={getDirection()}><MyPlansPage/></MoveSideways>}/>
            </Routes>
        </AnimatePresence>
        
    </div>
    )
}

export default AnimatedRoutes
