import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';
import AuthForm from './components/Authform';
import JournalDashboard from './components/JournalDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/dashboard" element={<JournalDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;