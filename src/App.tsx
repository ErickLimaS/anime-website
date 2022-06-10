import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer';
import Header from './Components/Header';
import Home from './Page/Home';
import * as C from './styles';

function App() {
  return (
    <BrowserRouter >
      <C.Container>

        <Header />

        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>

        <Footer />

      </C.Container>
    </BrowserRouter>
  );
}

export default App;
