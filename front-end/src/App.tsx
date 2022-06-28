import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Footer from './Components/Footer';
import Header from './Components/Header';
import AnimePage from './Page/MediaPage/AnimePage';
import Home from './Page/Home';
import MangaPage from './Page/MediaPage/MangaPage';
import MoviePage from './Page/MediaPage/MoviePage';
import * as C from './styles';
import GenrePage from './Page/GenrePage';
import FormatPage from './Page/FormatPage';
import RegisterUser from './Page/User/RegisterUser';
import LoginUser from './Page/User/LoginUser';
import { useSelector } from 'react-redux';
import SettingsUser from './Page/User/SettingsUser';
import BookmarkUser from './Page/User/BookmarksUser';
import AnimePageV2 from './Page/MediaPage/AnimePageV2';

function App() {

  //Checks if user is Logged In
  const userLogin = useSelector((state: any) => state.userLogin)

  const { userInfo } = userLogin

  window.scrollTo(0, 0);
  
  return (
    <BrowserRouter >
      <C.Container>

        <Header />

        <Routes>

          <Route path='/login' element={!userInfo ? <LoginUser /> : <Navigate to='/' />} />

          <Route path='/register' element={!userInfo ? <RegisterUser /> : <Navigate to='/' />} />

          <Route path='/bookmarks' element={<BookmarkUser />} />
          <Route path='/settings' element={<SettingsUser />} />
          <Route path='/format/:format' element={<FormatPage />} />
          <Route path='/genre/:genre' element={<GenrePage />} />
          <Route path='/anime/v2/:id' element={<AnimePageV2 />} />
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
