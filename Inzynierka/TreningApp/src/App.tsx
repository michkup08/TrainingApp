import './App.css'
import { UserProvider } from './assets/providers/UserProvider'
import Navbar from './assets/components/Navbar'
import HomePage from './assets/components/HomePage'
import { Route, Routes } from 'react-router-dom';
import ChatsPage from './assets/components/ChatsPage.tsx';
import LoginPage from './assets/components/LoginPage.tsx';
import RegisterPage from './assets/components/RegisterPage.tsx';
import Calendar from './assets/components/Calendar.tsx';


function App() {

  return (
    <div>
      <UserProvider>
        <Navbar/>
        <Routes>
            <Route path= '/' element= {<HomePage/>} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/chats" element={<ChatsPage/>}/>
            <Route path='/trainingPlan' element={<Calendar/>}/>
        </Routes>
      </UserProvider>
    </div>
  )
}

export default App
