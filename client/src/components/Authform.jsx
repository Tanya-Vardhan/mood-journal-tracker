import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isLogin) {
        // Login
        const response = await axios.post(`${API_URL}/login`, { username, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        navigate('/dashboard');
      } else {
        // Sign-up
        const response = await axios.post(`${API_URL}/register`, { username, password });
        setMessage(response.data.message);
        setIsLogin(true); // Switch to login after successful sign-up
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="bg-[#FFF5F2] min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white justify-center p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Log In' : 'Sign Up'}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          {/* button */}
          <div className='w-full my-2 py-2 flex justify-center'>
            <button
            type="submit"
            className="w-1/3 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
          </div>
          
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
        {/* button */}
        <div className='w-full my-2 py-2 flex justify-center'>
           <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 w-1/3 rounded-xl mx-auto text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
        </button>
        </div>
       
      </div>
    </div>
  );
}

export default AuthForm;