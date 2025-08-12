import './App.css';
import Navbars from './components/Navbars';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Test from './components/Test';
import Login from './components/Login';
import { useState } from 'react';
import JobList from './components/JobsList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const handleLogin = () => {
    setIsAuthenticated(true);
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      {/* Only show Navbar if authenticated */}
      {isAuthenticated && <Navbars onLogout={handleLogout} />}
      
      <div className='container'>
        <Routes>

          <Route 
            path="/" 
            element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} 
          />
          
          <Route 
            path="/Test" 
            element={isAuthenticated ? <Test /> : <Navigate to="/login" replace /> } 
          />


          <Route 
            path="/JobsList" 
            element={isAuthenticated ? <JobList /> : <Navigate to="/login" replace /> } 
          />
          
          {/* Login route accessible to all */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} /> } 
          />

        </Routes>
      </div>
    </>
  );
}

export default App;