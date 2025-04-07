import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Common components
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import StarSummary from './pages/StarSummary';
import Documentation from './pages/Documentation';
import Connections from './pages/Connections';
import Jobs from './pages/Jobs';
import MoodCheck from './pages/MoodCheck';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/star-summary" element={<StarSummary />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/mood-check" element={<MoodCheck />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;