import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Locations from './pages/Locations';
import Agents from './pages/Agents';
import Rentals from './pages/Rentals';
import Favorites from './pages/Favorites';
import AgentDashboard from './pages/AgentDashboard';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ContactForm from './components/ContactForm';
import AddProperty from './components/AddProperty';
import useUserStore from './stores/userStore';
import useThemeStore from './stores/themeStore';
import './index.css'

function App() {
  const { user, logout } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-blue-600 dark:bg-blue-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-2xl font-bold">LEGIT ESTATE</h1>
            <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Home</Link>
            <Link to="/properties" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Properties</Link>
            <Link to="/locations" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Locations</Link>
            <Link to="/rentals" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Rentals</Link>
            <Link to="/agents" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Agents</Link>
            {user?.role === 'agent' && <Link to="/agent-dashboard" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Agent Dashboard</Link>}
            {user && <Link to="/favorites" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Favorites</Link>}
            {user && <Link to="/profile" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Profile</Link>}
            {user?.role === 'agent' && <Link to="/add-property" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Add Property</Link>}
            <Link to="/contact" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Contact</Link>
          </div>
          <div className="flex space-x-4 items-center">
            <button onClick={toggleTheme} className="text-white hover:bg-blue-700 px-3 py-2 rounded">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white">Welcome, {user.name}</span>
                <button onClick={logout} className="text-white hover:bg-blue-700 px-3 py-2 rounded">Logout</button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Login</Link>
                <Link to="/register" className="text-white hover:bg-blue-700 px-3 py-2 rounded">Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactForm />} />
      </Routes>
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2026 Real Estate Website. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;