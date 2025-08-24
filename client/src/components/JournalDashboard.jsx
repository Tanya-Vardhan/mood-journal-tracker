import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/moods';

function JournalDashboard() {
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
    <div className="bg-[#FFF5F2] min-h-screen p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Hello, {username}!</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="How are you feeling?"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add some notes..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Entry
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Journals</h2>
          {entries.length > 0 ? (
            entries.map((entry) => (
              <div key={entry._id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-700">{entry.mood}</p>
                  <p className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                  {entry.notes && <p className="text-gray-600 mt-1">{entry.notes}</p>}
                </div>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No entries yet. Add your first journal entry!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JournalDashboard;