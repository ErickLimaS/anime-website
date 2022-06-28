import * as C from './styles'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import AsideNavLinks from '../../../Components/AsideNavLinks'


export default function SettingsUser() {

  const userLogin = useSelector((state: any) => state.userLogin)
  const { userInfo } = userLogin

  const navigate = useNavigate()

  useEffect(() => {

    if (!userInfo) {

      navigate('/')

    }

  }, [navigate, userInfo])


  return (
    <C.Container>

      <AsideNavLinks />

      settings

    </C.Container>
  )
}
