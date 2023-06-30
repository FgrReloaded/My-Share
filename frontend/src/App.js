import React from 'react';
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Service from './Service';
import Home from './Home';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/my-share/room=:room" element={<Service />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
      </Router>
    </>

  )
}

export default App;
