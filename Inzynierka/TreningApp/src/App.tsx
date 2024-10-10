import './App.css'
import { UserProvider } from './assets/providers/UserProvider'
import Navbar from './assets/components/Navbar'
import AnimatedRoutes from './AnimatedRoutes'


function App() {

  return (
    <div>
      <UserProvider>
        <Navbar/>
        <AnimatedRoutes/>
      </UserProvider>
    </div>
  )
}

export default App
