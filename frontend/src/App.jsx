// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './contexts/ProfileContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreatePage from './pages/CreatePage';
import ConnectPage from './pages/ConnectPage';
import ElevatePage from './pages/ElevatePage';
import ChatPage from './pages/ChatPage';
import ProfileEditor from './components/ProfileEditor';

function App() {
  return (
    <ProfileProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
              <Routes>
                <Route path="/" element={<CreatePage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/connect" element={<ConnectPage />} />
                <Route path="/elevate" element={<ElevatePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/profile" element={<ProfileEditor />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ProfileProvider>
  );
}

export default App;