import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ReactComponent as LoadingSvg } from '../../../imgs/svg/Spinner-1s-200px.svg'
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import HeaderAlternative from '../../../Components/HeaderAlternative';
import { registerUser } from '../../../redux/actions/userActions';
import * as C from './styles'

export default function RegisterUser() {

    const name = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const email = React.useRef() as React.MutableRefObject<HTMLInputElement>
    const password = React.useRef() as React.MutableRefObject<HTMLInputElement>
    const confirmPassword = React.useRef() as React.MutableRefObject<HTMLInputElement>

    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    // dark mode
    const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
    const { darkMode } = darkModeSwitch

    const redirect = window.location.search ? `/${window.location.search.split(`=`)[1]}` : "/"
    const navigate = useNavigate()

    window.scrollTo(0, 0);
    
    useEffect(() => {

        document.title = 'Register | AniProject'

        if (userInfo) {
            navigate(`${redirect}`)
        }

    }, [])

    const dispatch: any = useDispatch()

    const userRegister = useSelector((state: any) => state.userRegister)

    const { loading, error } = userRegister

    //handles errors
    const errorAlert = (errorStatus: any) => {

        switch (errorStatus) {
            case 400:
                Swal.fire({

                    icon: 'warning',
                    title: 'Error',
                    titleText: `${errorStatus}: Password Incorrect!`,
                    text: 'Password Incorrect. Try Typing Again!'

                })
                break
            case 403:
                Swal.fire({

                    icon: 'info',
                    title: 'Error',
                    titleText: `${errorStatus}: Before Log In!`,
                    text: 'We need you to activy what makes our DataBase works. Enter on The Link below and Try Again!',
                    allowOutsideClick: false,
                    footer: 'https://cors-anywhere.herokuapp.com/'
                })
                break
            case 404:
                Swal.fire({

                    icon: 'info',
                    title: 'Error',
                    titleText: `${errorStatus}: Email Not Registered!`,
                    text: 'This Email Is Not on Our Database. Register Your Account.'

                })
                break
            default:
                Swal.fire({

                    icon: 'error',
                    title: 'Error',
                    titleText: `${errorStatus}: Something Happen!`,
                    text: "We Don't Know What Happen. But Try Again!"

                })
                break
        }

    }

    const formHandler = (e: React.FormEvent) => {

        e.preventDefault()

        if (password.current.value !== confirmPassword.current.value) {

            return Swal.fire({
                icon: 'warning',
                title: 'Ops',
                titleText: 'Problem With Your Password!',
                text: "Your Passwords don't match! Check Then and Try Again!"
            })

        }
        else if (password.current.value.length < 8) {

            return Swal.fire({

                icon: 'warning',
                title: 'Ops',
                titleText: 'Password Is Too Short!',
                text: 'The Password Is Below 8 Characters. Try Typing Again!'

            })

        }
        else {

            dispatch(registerUser(name.current.value, email.current.value, password.current.value))

        }
    }

    return (
        <>
            <HeaderAlternative />
            <C.Container darkMode={darkMode}>

                <div className='text'>

                    <h1>Create Your Account and Stay Up to Date With New Animes!</h1>

                    <ul>
                        <li>Favorite Your Animes, Mangas or Movies</li>
                        <li>Receive Notifications When A New Episodes Releases</li>
                        <li>Example</li>
                    </ul>

                </div>


                <form onSubmit={(e) => formHandler(e)}>


                    <h1>Register</h1>

                    {loading && (
                        <LoadingSvg />
                    )}
                    {error && (
                        // errorAlert(error.status())
                        <span id='error'>error: {error}</span>
                    )}

                    <div>
                        <label htmlFor='name'>Name</label>
                        <input type='text' id='name' placeholder='Name' ref={name} required></input>
                    </div>

                    <div>
                        <label htmlFor='email'>Email</label>
                        <input type='email' id='email' placeholder='Email' ref={email} required></input>
                    </div>

                    <div>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' placeholder='Password' ref={password} required></input>
                    </div>

                    <div>
                        <label htmlFor='confirm-password'>Confirm Password</label>
                        <input type='password' id='confirm-password' placeholder='Confirm Password' ref={confirmPassword} required></input>
                    </div>

                    <div>
                        <button type='submit' id='submit'>Register</button>
                    </div>

                    <div className='login'>
                        <Link to={`/login`}>Already have a Account? Click Here!</Link>
                    </div>


                </form>
            </C.Container>

        </>
    )
}
