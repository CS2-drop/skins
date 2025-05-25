import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CaseOpener from './components/CaseOpener';
import StatsFeed from './components/StatsFeed';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

import './styles/App.scss';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<CaseOpener />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Add routes for rules, FAQ, contact, etc. */}
          </Routes>
          <StatsFeed />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;