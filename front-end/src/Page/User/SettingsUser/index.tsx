import * as C from './styles'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import AsideNavLinks from '../../../Components/AsideNavLinks'


export default function SettingsUser() {

  const userLogin = useSelector((state: any) => state.userLogin)
  const { userInfo } = userLogin

  const [tabIndex, setTabIndex] = useState<number>(0)

  const nameRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
  const emailRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
  const passwordRef = React.useRef() as React.MutableRefObject<HTMLInputElement>
  const confirmPassowrdRef = React.useRef() as React.MutableRefObject<HTMLInputElement>

  const navigate = useNavigate()

  useEffect(() => {

    if (!userInfo) {

      navigate('/')

    }

  }, [navigate, userInfo])

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault()

    //make submit

  }


  return (
    <C.Container tabIndex={tabIndex}>

      <AsideNavLinks />

      <div className='content'>

        <div className='menu-profile'>

          <ul>
            <li onClick={() => setTabIndex(0)}>User Profile</li>
            <li onClick={() => setTabIndex(1)}>User ID</li>
            <li onClick={() => setTabIndex(2)}>Bookmark Data</li>
          </ul>

        </div>

        <div className='user' id='index-0'>

          {userInfo && (
            <h1>{userInfo.name}'s Profile</h1>
          )}

          <div className='user-avatar'>
            <img src='https://i.pinimg.com/originals/8e/de/53/8ede538fcf75a0a1bd812810edb50cb7.jpg' alt='User Avatar' onClick={() => console.log('')}></img>
            <div className='middle'>
              <span>Change Avatar</span>
            </div>
          </div>

          <form onSubmit={(e) => handleSubmit(e)}>

            <div>
              <label htmlFor='name'>Change Name</label>
              <input type='text' id='name' placeholder={`${userInfo.name}`} ref={nameRef}></input>
            </div>

            <div>
              <label htmlFor='email'>Change Email</label>
              <input type='email' id='email' placeholder={`${userInfo.email}`} ref={emailRef}></input>
            </div>

            <div>
              <label htmlFor='new-password'>Change Password</label>
              <input type='password' id='new-password' placeholder='********' ref={passwordRef}></input>
            </div>

            <div>
              <label htmlFor='confirm-new-password'>Confirm New Password</label>
              <input type='password' id='confirm-new-password' placeholder='********' ref={confirmPassowrdRef}></input>
            </div>

            <div>
              <button type='submit'>Submit Changes</button>
            </div>

          </form>

        </div>

        <div id='index-1'></div>
        <div id='index-2'></div>

      </div>
    </C.Container>
  )
}
