import * as C from './styles'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import { ReactComponent as LoadingSvg } from '../../../imgs/svg/Spinner-1s-200px.svg'
import { changeAdultContentOption, removeDataFromUserMedia, updateAvatarImg, updateUserInfo } from '../../../redux/actions/userActions'


export default function SettingsUser() {

  // user state
  const userLogin = useSelector((state: any) => state.userLogin)
  const { userInfo } = userLogin

  // dark mode
  const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
  const { darkMode } = darkModeSwitch

  const updateUserInfoRedux = useSelector((state: any) => state.updateUserInfo)
  const errorUpdateUser = updateUserInfoRedux.error

  const updateAvatarImgRedux = useSelector((state: any) => state.updateAvatarImg)
  const errorUpdateAvatarImg = updateAvatarImgRedux.error
  const loadingUpdateAvatarImg = updateAvatarImgRedux.loading

  const deleteUserMediaRedux = useSelector((state: any) => state.deleteUserMedia)
  const errorDeleteUserMedia = deleteUserMediaRedux.error

  const [tabIndex, setTabIndex] = useState<number>(0)

  //TAB 1
  const nameRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
  const emailRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
  const currentPasswordRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
  const newPasswordRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
  const confirmNewPassowrdRef = React.useRef() as React.MutableRefObject<HTMLInputElement>

  const [handleAvatarImgPanel, setHandleAvatarImgPanel] = useState<boolean>(false)

  //TAB 2
  const [handleChangeVisibility, setHandleChangeVisibility] = useState<boolean>(false)

  const navigate = useNavigate()

  const dispatch: any = useDispatch()

  useEffect(() => {

    document.title = 'Settings | AniProject'

    if (!userInfo) {

      navigate('/')

    }

  }, [navigate, userInfo])

  // set new Image to User Profile
  const setNewAvatarImg = (urlNewImg: String) => {

    dispatch(updateAvatarImg(urlNewImg))

  }

  //form Change User Info 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentPasswordRef.current.value.length >= 8) {

      if (newPasswordRef.current.value === confirmNewPassowrdRef.current.value) {

        dispatch(updateUserInfo(nameRef.current.value, emailRef.current.value, currentPasswordRef.current.value, newPasswordRef.current.value))

      }
      else {

        Swal.fire({

          icon: 'warning',
          title: 'Error',
          titleText: `New Password Don't Match with Confirm New Password!`,
          text: 'Try Typing Again!'

        })

      }

    }
    else {

      Swal.fire({

        icon: 'error',
        title: 'Error',
        titleText: `Current Password is Not Correct!`,
        text: 'Try Typing Again!'

      })

    }

  }

  //form change adult Content config for all results
  const adultsOnlyConfigChange = (e: React.FormEvent) => {
    e.preventDefault()

    const form: any = document.getElementById("adult-content")

    //parsing to Boolean
    const formValue: Boolean = (form.elements["adult-content"].value === 'true')
    const userConfigValue: Boolean = userInfo.showAdultContent

    if (formValue !== userConfigValue) {

      dispatch(changeAdultContentOption())

      Swal.fire({
        icon: "success",
        title: 'Changes Saved!',
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        didClose: () => {
          window.location.reload()
        }
      })

    }

  }

  //removes all data from bookmarks
  const handleEraseData = () => {

    dispatch(removeDataFromUserMedia())

  }

  //success mensages
  if (errorUpdateUser === false || errorUpdateAvatarImg === false || errorDeleteUserMedia === false) {

    switch (errorUpdateUser || errorUpdateAvatarImg || errorDeleteUserMedia) {
      case 200:
        Swal.fire({

          icon: 'success',
          title: 'Success',
          titleText: `Success`,
          text: "Everything Went Fine!",
          allowOutsideClick: true
        })
        break
      default:
        Swal.fire({

          icon: 'success',
          title: 'Success',
          titleText: `Success`,
          text: "Everything Went Fine!"

        })
        break
    }

  }

  return (
    <C.Container
      tabIndex={tabIndex}
      handleAvatarImgPanel={handleAvatarImgPanel}
      darkMode={darkMode}
    >

      <div className='content'>

        <div className='menu'>

          <ul>
            <li onClick={() => setTabIndex(0)} data-tab="0" >User Profile</li>
            <li onClick={() => setTabIndex(1)} data-tab="1" >User ID</li>
            <li onClick={() => setTabIndex(2)} data-tab="2" >Bookmark Data</li>
            <li onClick={() => setTabIndex(3)} data-tab="3" >Search Results</li>
          </ul>

        </div>

        <div className='user-info' data-index="0">

          {userInfo && (
            <h1>{userInfo.name}'s Profile</h1>
          )}

          <div className='user-avatar'>
            <img src={userInfo.avatarImg} alt='User Avatar' onClick={() => setHandleAvatarImgPanel(!handleAvatarImgPanel)}></img>
            <div className='middle'>
              <span onClick={() => setHandleAvatarImgPanel(!handleAvatarImgPanel)}>Change Avatar</span>
            </div>
          </div>

          <div className='avatar-img-panel'>

            <button type='button' onClick={() => setHandleAvatarImgPanel(!handleAvatarImgPanel)}>
              Close Panel
            </button>

            {loadingUpdateAvatarImg && (
              <LoadingSvg />
            )}

            <div className='imgs'>

              <div onClick={() => setNewAvatarImg('https://i.pinimg.com/originals/8e/de/53/8ede538fcf75a0a1bd812810edb50cb7.jpg')}>
                <img src='https://i.pinimg.com/originals/8e/de/53/8ede538fcf75a0a1bd812810edb50cb7.jpg' alt='User Avatar'></img>
                <small>Satoru Gojo</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://pm1.narvii.com/6445/d9dff8ed0332a39b97195b55fa6f597c82d9c1b6_hq.jpg')}>
                <img src='https://pm1.narvii.com/6445/d9dff8ed0332a39b97195b55fa6f597c82d9c1b6_hq.jpg' alt='User Avatar'></img>
                <small>Pain</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://sm.ign.com/t/ign_br/screenshot/default/nezuko_vw8x.1080.jpg')}>
                <img src='https://sm.ign.com/t/ign_br/screenshot/default/nezuko_vw8x.1080.jpg' alt='User Avatar'></img>
                <small>Nezuko</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://sm.ign.com/t/ign_br/screenshot/default/gyu_cntb.1080.jpg')}>
                <img src='https://sm.ign.com/t/ign_br/screenshot/default/gyu_cntb.1080.jpg' alt='User Avatar'></img>
                <small>Gyu</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://i.pinimg.com/originals/9a/dc/0a/9adc0a65a1f20e91161a695c7f590397.png')}>
                <img src='https://i.pinimg.com/originals/9a/dc/0a/9adc0a65a1f20e91161a695c7f590397.png' alt='User Avatar'></img>
                <small>Midoriya</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://i0.wp.com/www.jbox.com.br/wp/wp-content/uploads/2021/08/todoroki-my-hero-academia-s5-destacada.jpg?w=774&quality=99&strip=all&ssl=1')}>
                <img src='https://i0.wp.com/www.jbox.com.br/wp/wp-content/uploads/2021/08/todoroki-my-hero-academia-s5-destacada.jpg?w=774&quality=99&strip=all&ssl=1' alt='User Avatar'></img>
                <small>Shoto Todoroki</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://i.pinimg.com/originals/75/b2/68/75b26876181a4fd49c56b93e021c9e3c.jpg')}>
                <img src='https://i.pinimg.com/originals/75/b2/68/75b26876181a4fd49c56b93e021c9e3c.jpg' alt='User Avatar'></img>
                <small>Naruto</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://aniyuki.com/wp-content/uploads/2022/04/aniyuki-sasuke-uchiha-avatar-29-986x1024.jpg')}>
                <img src='https://aniyuki.com/wp-content/uploads/2022/04/aniyuki-sasuke-uchiha-avatar-29-986x1024.jpg' alt='User Avatar'></img>
                <small>Sasuke</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://aniyuki.com/wp-content/uploads/2022/04/aniyuki-sasuke-uchiha-avatar-31-1024x1017.jpg')}>
                <img src='https://aniyuki.com/wp-content/uploads/2022/04/aniyuki-sasuke-uchiha-avatar-31-1024x1017.jpg' alt='User Avatar'></img>
                <small>Sasuke</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://i.pinimg.com/originals/4d/86/5e/4d865ea47a8675d682ff35ad904a0af6.png')}>
                <img src='https://i.pinimg.com/originals/4d/86/5e/4d865ea47a8675d682ff35ad904a0af6.png' alt='User Avatar'></img>
                <small>Goku</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://static1.personality-database.com/profile_images/eacff6bded0a4bdfae7034476dbb52f5.png')}>
                <img src='https://static1.personality-database.com/profile_images/eacff6bded0a4bdfae7034476dbb52f5.png' alt='User Avatar'></img>
                <small>Frieza</small>
              </div>
              <div onClick={() => setNewAvatarImg('https://avatars.githubusercontent.com/u/24864574?v=4')}>
                <img src='https://avatars.githubusercontent.com/u/24864574?v=4' alt='User Avatar'></img>
                <small>Madara</small>
              </div>
            </div>

          </div>

          <form onSubmit={(e) => handleSubmit(e)}>

            <div>
              <label htmlFor='name'>Change Name</label>
              <input type='text' id='name' placeholder={`${userInfo.name}`} ref={nameRef}></input>
            </div>

            <div>
              <label htmlFor='email'>Change Email</label>
              <input type='email' id='email' placeholder={`Your New Email`} ref={emailRef}></input>
            </div>

            <div>
              <label htmlFor='current-password'>Current Password <span>*</span></label>
              <input type='password' id='current-password' placeholder='********' ref={currentPasswordRef} required></input>
            </div>

            <div>
              <label htmlFor='new-password'>New Password</label>
              <input type='password' id='new-password' placeholder='********' ref={newPasswordRef}></input>
            </div>

            <div>
              <label htmlFor='confirm-new-password'>Confirm New Password</label>
              <input type='password' id='confirm-new-password' placeholder='********' ref={confirmNewPassowrdRef}></input>
            </div>

            <div>
              <button type='submit'>Submit Changes</button>
            </div>

          </form>

        </div>

        <div className='user-info' data-index="1" >

          <h1>This is Your ID</h1>

          <div>
            <label htmlFor='user-id'>User ID</label>

            {handleChangeVisibility ? (
              <>
                <span id='user-id'>{userInfo.id}</span>

                <button type='button' onClick={() => setHandleChangeVisibility(!handleChangeVisibility)}>Hide ID</button>
              </>
            ) : (
              <>
                <h2 id='user-id'>*****************</h2>
                <button type='button' onClick={() => setHandleChangeVisibility(!handleChangeVisibility)}>Show ID</button>
              </>
            )}

          </div>

        </div>

        <div className='user-info' data-index="2" >

          <h1>Bookmark Data</h1>

          <h2>Erase <strong>all data</strong> you have save until now on this account?</h2>

          <button type='button' onClick={() => handleEraseData()}>Yes, erase all Data!</button>

        </div>

        <div className='user-info' data-index="3" >

          <h1>Search Results Settings</h1>

          <form id='adult-content' onSubmit={(e) => adultsOnlyConfigChange(e)}>

            <h2><span>+18</span> Adult Content ({userInfo.showAdultContent ? `Currently Showing` : 'Currently NOT Showing'})</h2>

            <div className='radio-inputs'>

              <div>
                <label htmlFor='adult-content-yes'>
                  <input type='radio' value='true' id='adult-content-yes' name='adult-content'></input> Show Adult Content
                </label>
              </div>

              <div>
                <label htmlFor='adult-content-no'>
                  <input type='radio' value='false' id='adult-content-no' name='adult-content' checked></input>Do Not Show Adult Content
                </label>
              </div>

            </div>

            <small>If you are 18+, checking this box will allow you to see search results and other contents for ADULTS ONLY.</small>

            <div>
              <button type='submit'>Save Changes</button>
            </div>

          </form>

        </div>

      </div>

    </C.Container>
  )
}
