import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Plus, Trash2, Smile, PenTool, Calendar, Quote } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/moods`;

function JournalDashboard() {
  // const mainBg removed
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // Redirect to homepage if no token
    } else {
      setUsername(localStorage.getItem('username'));
      fetchEntries(token);
    }
  }, [navigate]);

  const fetchEntries = async (token) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'x-auth-token': token,
        },
      });
      console.log("Fetched entries:", response.data);
      setEntries(response.data);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
      // Handle unauthorized error, e.g., token expired
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(API_URL, { mood, notes }, {
        headers: {
          'x-auth-token': token,
        },
      });
      setMood('');
      setNotes('');
      fetchEntries(token);
    } catch (error) {
      console.error("Failed to add entry:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      fetchEntries(token);
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-[#0f172a] via-[#1e1a78] to-[#2d0b5e]">
      <div className="max-w-3xl mx-auto">

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
              {username ? username[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Hello, {username}!</h1>
              <p className="text-xs text-gray-300">Ready to reflect today?</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 text-red-200 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 border border-red-500/30"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>

        {/* New Entry Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-2xl shadow-2xl mb-10 relative overflow-hidden group">
          {/* Decorative blurred blob */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-500"></div>

          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="text-pink-500" /> New Entry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Smile className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="How are you feeling right now?"
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                <PenTool className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write down your thoughts..."
                rows="3"
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-500/30 hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Add to Journal
            </button>
          </form>
        </div>

        {/* Entries List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 ml-1">
            <Quote className="text-purple-400 rotate-180" size={24} /> Your Journey
          </h2>

          <div className="grid gap-4">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div key={entry._id} className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-lg transition-all duration-300 group relative">
                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-medium text-gray-400 bg-black/20 px-2 py-1 rounded-lg border border-white/5">
                    <Calendar size={12} />
                    {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  <div className="pr-24"> {/* Padding for delete button and date */}
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-3xl">
                        {/* Simple emoji mapping based on mood text length or just generic for now as we don't have analysis yet */}
                        ✨
                      </span>
                      <h3 className="text-xl font-bold text-white capitalize">{entry.mood}</h3>
                    </div>
                    {entry.notes && (
                      <p className="text-gray-300 leading-relaxed text-sm pl-1 border-l-2 border-purple-500/50">
                        {entry.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="absolute bottom-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    title="Delete Entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                <div className="inline-flex p-4 rounded-full bg-white/5 mb-4 text-gray-500">
                  <PenTool size={32} />
                </div>
                <p className="text-gray-400 text-lg">Your journal is empty.</p>
                <p className="text-gray-600 text-sm">Add your first entry above!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default JournalDashboard;