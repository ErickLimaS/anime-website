import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Footer from './Components/Layout/Footer';
import Header from './Components/Layout/Header';
import AnimePage from './Page/MediaPage/AnimePage';
import Home from './Page/Home';
import MangaPage from './Page/MediaPage/MangaPage';
import MoviePage from './Page/MediaPage/MoviePage';
import * as C from './styles';
import GenrePage from './Page/GenrePage';
import FormatPage from './Page/FormatPage';
import RegisterUser from './Page/User/RegisterUser';
import LoginUser from './Page/User/LoginUser';
import { useDispatch, useSelector } from 'react-redux';
import SettingsUser from './Page/User/SettingsUser';
import BookmarkUser from './Page/User/BookmarksUser';
import AnimePageV2 from './Page/MediaPage/AnimePageV2';
import NovelPage from './Page/MediaPage/NovelPage';
import OneShotPage from './Page/MediaPage/OneShotPage';
import OvaPage from './Page/MediaPage/OvaPage';
import SpecialPage from './Page/MediaPage/SpecialPage';
import OnaPage from './Page/MediaPage/OnaPage';
import TvShortPage from './Page/MediaPage/TvShortPage';
import { logoutUser } from './redux/actions/userActions';
import Swal from 'sweetalert2';
import ErrorPage from './Page/ErrorPage';
import HistoryMediaAdded from './Page/User/HistoryMediaWatched';
import Layout from './Components/Layout/Layout';

function App() {

  //Checks if user is Logged In
  const userLogin = useSelector((state: any) => state.userLogin)

  // dark mode
  const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
  const { darkMode } = darkModeSwitch

  const addMediaToUserAccount = useSelector((state: any) => state.addMediaToUserAccount)
  const removeMediaFromUserAccount = useSelector((state: any) => state.removeMediaFromUserAccount)
  const updateAvatarImg = useSelector((state: any) => state.updateAvatarImg)
  const updateUserInfo = useSelector((state: any) => state.updateUserInfo)
  const deleteUserMedia = useSelector((state: any) => state.deleteUserMedia)
  const addFromAlreadyWatched = useSelector((state: any) => state.addFromAlreadyWatched)
  const removeFromAlreadyWatched = useSelector((state: any) => state.removeFromAlreadyWatched)

  const { userInfo } = userLogin

  //handles token expiration error, forcing log out to get a new token 
  const userError = userLogin.error
  const remError = removeMediaFromUserAccount.error
  const updateAvatarError = updateAvatarImg.error
  const updateUserError = updateUserInfo.error
  const addError = addMediaToUserAccount.error
  const deleteMediaError = deleteUserMedia.error
  const addWatchedError = addFromAlreadyWatched?.error
  const removeWatchedError = removeFromAlreadyWatched?.error

  const dispatch: any = useDispatch()

  //if theres a error, it shows what happen
  if (userError || addError || remError || updateAvatarError || updateUserError || deleteMediaError || addWatchedError || removeWatchedError) {

    //store current media url to redirect if user is not logged in
    const redirect = window.location.pathname ? `${window.location.pathname}` : ''

    switch (userError || addError || remError || updateAvatarError || updateUserError || deleteMediaError || addWatchedError || removeWatchedError) {
      case 403: //CORS
        Swal.fire({

          icon: 'info',
          title: 'Error',
          titleText: `${userError || addError || remError || updateAvatarError || updateUserError || deleteMediaError || addWatchedError || removeWatchedError}: Before Doing It!`,
          text: 'First, we need you to activate what makes our DataBase works. Enter on The Link below and Try Again!',
          allowOutsideClick: false,
          footer: 'https://cors-anywhere.herokuapp.com/',
          didClose: () => {
            window.location.reload()
          }
        })
        break
      case 401: //TOKEN VALIDATION/EXPIRATION
        Swal.fire({
          icon: 'warning',
          title: 'Security First!',
          titleText: `${userError || addError || remError || updateAvatarError || updateUserError || deleteMediaError || addWatchedError || removeWatchedError}: Security First!`,
          text: 'You Will Need To Login Again So We Will Make Your Account Secure!',
          allowOutsideClick: false,
          didClose: () => {

            dispatch(logoutUser())
            window.location.href = redirect !== '' ? `/login?redirect=${redirect.slice(1, redirect.length)}` : '/login'

          }
        })
        break
      default:
        Swal.fire({

          icon: 'error',
          title: 'Error',
          titleText: `${userError || addError || remError || updateAvatarError || updateUserError || deleteMediaError || addWatchedError || removeWatchedError}: Something Happen!`,
          text: "We Don't Know What Happen. But Try Again!",
          footer: 'Or report this on My GitHub: www.github.com/ErickLimaS',
          didClose: () => {
            window.location.reload()
          }

        })
        break
    }

  }

  window.scrollTo(0, 0);

  return (
    <BrowserRouter >
      <C.Container
        darkMode={darkMode}
      >

        <Header />

        <Routes>

          {/* USER LOG IN/SIGN UP */}
          <Route path='/login' element={<LoginUser />} />
          <Route path='/register' element={<RegisterUser />} />

          {/* USER CATEGORY */}
          <Route path='/bookmarks' element={userInfo ? < BookmarkUser /> : <Navigate to='/' />} />
          <Route path='/history' element={userInfo ? < HistoryMediaAdded /> : <Navigate to='/' />} />
          <Route path='/settings' element={userInfo ? <SettingsUser /> : <Navigate to='/' />} />

          {/* MEDIA CATEGORY */}
          <Route path='/format/:format' element={<FormatPage />} />
          <Route path='/genre/:genre' element={<GenrePage />} />

          <Route path='/anime/v2/:id' element={<AnimePageV2 />} />

          {/* MEDIA Page */}
          <Route path='/tv-short/:id' element={<TvShortPage />} />
          <Route path='/ona/:id' element={<OnaPage />} />
          <Route path='/ova/:id' element={<OvaPage />} />
          <Route path='/special/:id' element={<SpecialPage />} />
          <Route path='/one-shot/:id' element={<OneShotPage />} />
          <Route path='/novel/:id' element={<NovelPage />} />
          <Route path='/anime/:id' element={<Layout children={<AnimePage />} />} />
          <Route path='/movie/:id' element={<MoviePage />} />
          <Route path='/manga/:id' element={<MangaPage />} />

          {/* HOME */}
          <Route path='/' element={<Layout children={<Home />} />} />

          {/* 404 ERROR */}
          <Route path='*' element={<ErrorPage />} />

        </Routes>

        <Footer />

      </C.Container>
    </BrowserRouter>
  );
}

export default App;
