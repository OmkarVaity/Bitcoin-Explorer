import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import BlockHeight from './components/BlockHeight';
import MetricsSection from './components/MetricsSection';

function App() {
  return (
    <div className = "App">
        <Header />
        <BlockHeight />
        <MetricsSection /> 
    </div>
  );
}

export default App;
