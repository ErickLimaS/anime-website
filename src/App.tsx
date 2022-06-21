import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer';
import Header from './Components/Header';
import AnimePage from './Page/MediaPage/AnimePage';
import Home from './Page/Home';
import MangaPage from './Page/MediaPage/MangaPage';
import MoviePage from './Page/MediaPage/MoviePage';
import * as C from './styles';
import GenrePage from './Page/GenrePage';

function App() {
  return (
    <BrowserRouter >
      <C.Container>

        <Header />

        <Routes>
          <Route path='/genre/:genre' element={<GenrePage />} />
          <Route path='/anime/:id' element={<AnimePage />} />
          <Route path='/movie/:id' element={<MoviePage />} />
          <Route path='/manga/:id' element={<MangaPage />} />
          <Route path='/' element={<Home />} />
        </Routes>

        <Footer />

      </C.Container>
    </BrowserRouter>
  );
}

export default App;
