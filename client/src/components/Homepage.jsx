import { Link } from 'react-router-dom';

function HomePage() {
  
  return (
    <div className="bg-[#FFF5F2] min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl px-4 font-extrabold text-gray-800 mb-6">Welcome to Mood Journal Tracker</h1>
        <p className="text-lg text-gray-600 mb-8">
          Track your moods, reflect on your day, and see your progress over time.
        </p>
        <Link 
          to="/auth" 
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default HomePage;