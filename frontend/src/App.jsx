import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ShowBook from './pages/ShowBook.jsx';
import EditBook from './pages/EditBook.jsx';
import DeleteBook from './pages/DeleteBook.jsx';
import CreateBook from './pages/CreateBook.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Spinner from './components/Spinner.jsx';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Use to decode JWT token
import Navbar from './components/Navbar.jsx';
import NotFound from './pages/NotFound.jsx';
import { useSnackbar } from 'notistack';

// Function to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
};

const setCookie = (name, value) => {
  const expires = new Date(Date.now() + 1 * 60 * 60 * 1000).toUTCString(); // 1 hour in milliseconds
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; secure;  SameSite=Strict`;
};

const deleteCookie = (cookieName) => {
  document.cookie = `${cookieName}=; Max-Age=0; path=/;`;
}

// Function to delete cookie
// const deleteCookie = (name) => {
//   setCookie(name, '', -1); // Set expiration to the past
// };

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const token = getCookie('token');
  return token ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSessionExpiredAlert, setShowSessionExpiredAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  //  Function to store the token and set authentication status
  const setToken = (token) => {
    setCookie('token', token);
    setIsAuthenticated(true);
  };

  // Function to handle token expiration and logout
  const handleTokenExpiration = () => {
    deleteCookie('token');
    setShowSessionExpiredAlert(true);  // Show custom session expired alert
    setIsAuthenticated(false); // Update state to reflect the user is logged out
  };

  // Close the session expired alert and navigate to login
  const closeSessionExpiredAlert = () => {
    setShowSessionExpiredAlert(false);
    navigate('/login');
  };


  useEffect(() => {

    // Check if there's a token in URL parameters for Google login
    const urlParams = new URLSearchParams(location.search);
    const urlToken = urlParams.get('token');

    // If there is a token from Google login in the URL
    if (urlToken) {
      setCookie('token', urlToken); // Store token in cookie
      setIsAuthenticated(true);
      navigate('/');
    } else {
      // Check for the token in cookies for manual login
      const storedToken = getCookie('token');

      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000; // Current time in seconds

          if (decodedToken.exp < currentTime) {
            handleTokenExpiration(); // Handle token expiration
          } else {
            setIsAuthenticated(true);
          }
        } catch (err) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    // Global Axios interceptor for handling token expiration
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 402) {
          // If 402 error (Unauthorized - Token Expired), trigger token expiration handling
          handleTokenExpiration();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(axiosInterceptor);
    };
  }, [navigate, location]);  // Track changes in route using location


  // Handle logout by removing token from Cookies and updating authentication status
  const handleLogout = async () => {
    try {
      await axios.post('https://bookbazaar-backend.onrender.com/logout', {}, { withCredentials: true });
      deleteCookie('token');
      setIsAuthenticated(false);
      enqueueSnackbar('Logged Out Successfully!', { variant: 'success' })
      navigate('/');
    } catch (err) {
      enqueueSnackbar('Logout failed', { variant: 'error' });
    }
  };

  return (
    <div>

      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />

      {/* Session Expired Alert Modal */}
      {showSessionExpiredAlert && (
        <div className="session-expired-overlay">
          <div className="session-expired-modal">
            <h2>Session Expired</h2>
            <p>Your session has expired. Please log in again to continue.</p>
            <button onClick={closeSessionExpiredAlert}>OK</button>
          </div>
        </div>
      )}

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />

        {/* Catch-all route for non-existent paths */}
        <Route path="*" element={<NotFound />} />

        {/* Protected Routes */}
        <Route path="/books/create" element={
          <PrivateRoute>
            <CreateBook />
          </PrivateRoute>
        }
        />
        <Route path="/books/details/:id" element={
          <PrivateRoute>
            <ShowBook />
          </PrivateRoute>
        }
        />
        <Route path="/books/edit/:id" element={
          <PrivateRoute>
            <EditBook />
          </PrivateRoute>
        }
        />
        <Route path="/books/delete/:id" element={
          <PrivateRoute>
            <DeleteBook />
          </PrivateRoute>
        }
        />

      </Routes>
    </div>
  );
};

export default App;
