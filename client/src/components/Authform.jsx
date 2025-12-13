import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, ArrowRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/auth`;

function AuthForm() {
  // const mainBg removed

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0f172a] via-[#1e1a78] to-[#2d0b5e]">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Glow effect behind */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/30 rounded-full blur-[50px] pointer-events-none"></div>

        <h2 className="text-3xl font-bold text-center mb-2 text-white relative z-10">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-300 mb-8 relative z-10 text-sm">
          {isLogin ? 'Enter your details to access your journal' : 'Start your journey of self-reflection today'}
        </p>

        <form onSubmit={handleAuth} className="space-y-5 relative z-10">

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>

        </form>

        {message && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
            <p className="text-sm text-red-100">{message}</p>
          </div>
        )}

        <div className="mt-8 text-center relative z-10">
          <p className="text-gray-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-semibold text-white hover:text-purple-300 transition-colors underline decoration-purple-500/50 underline-offset-4"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default AuthForm;