import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SkillInput from './pages/SkillInput';
import Assessment from './pages/Assessment';
import SCIResult from './pages/SCIResult';
import SkillGap from './pages/SkillGap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/skill-input" element={<SkillInput />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/result" element={<SCIResult />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
