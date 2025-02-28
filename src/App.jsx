import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './global.css'

import { Home } from './home';
import { PainelAtleta } from './components/painelAtleta';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/atleta/:id" element={<PainelAtleta />} />
      </Routes>
    </Router>
  );
}

export default App
