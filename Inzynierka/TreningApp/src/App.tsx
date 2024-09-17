import './App.css'
import { UserProvider } from './assets/providers/UserProvider'
import Navbar from './assets/components/Navbar'
import HomePage from './assets/components/HomePage'
import { Route, Routes } from 'react-router-dom';
import ChatsPage from './assets/components/ChatsPage.tsx';
import LoginPage from './assets/components/LoginPage.tsx';
import RegisterPage from './assets/components/RegisterPage.tsx';
import MainTrainingPlan from './assets/components/MainTrainingPlanPage.tsx';
import EditTrainingPlan from './assets/components/EditTrainingPlan.tsx';
import MyPlansPage from './assets/components/MyPlansPage.tsx';
import ProfileEdition from './assets/components/ProfileEdition.tsx';


function App() {

  return (
    <div>
      <UserProvider>
        <Navbar/>
        <Routes>
            <Route path= '/' element= {<HomePage/>} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/profileEdition" element={<ProfileEdition/>}/>
            <Route path="/chats" element={<ChatsPage/>}/>
            <Route path='/trainingPlan' element={<MainTrainingPlan/>}/>
            <Route path='/trainingPlan/edit' element={<EditTrainingPlan/>}/>
            <Route path='/trainingPlan/usersPlans' element={<MyPlansPage/>}/>
        </Routes>
      </UserProvider>
    </div>
  )
}

export default App
