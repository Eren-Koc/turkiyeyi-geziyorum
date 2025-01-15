
import './index.css';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotExist from './pages/NotExist';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Login from './components/Login';
import { UserContextProvider } from './context/user-context';
import Contact from './pages/Contact';
import ResetPassword from './pages/ResetPassword';



function App() {
  return (
    <UserContextProvider>
    <div className="App">
      
    
      <BrowserRouter>
      <Login/>
    <Routes>

    <Route index element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="*" element={<NotExist />} />

    </Routes>
    </BrowserRouter>

    </div>
    </UserContextProvider>
  );
}

export default App;
