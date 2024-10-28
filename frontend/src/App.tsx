import React from 'react';
import './App.css';
import Header from './components/Header';
import MetricsSection from './components/MetricsSection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PricesPage from './components/PricesPage';
import About from './components/About';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/prices" element={<PricesPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
