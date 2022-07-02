import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { AnyAction, Dispatch } from 'redux';
import Swal from 'sweetalert2';
import { registerUser } from '../../../redux/actions/userActions';
import * as C from './styles'

export default function RegisterUser() {


    const name = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const email = React.useRef() as React.MutableRefObject<HTMLInputElement>
    const password = React.useRef() as React.MutableRefObject<HTMLInputElement>
    const confirmPassword = React.useRef() as React.MutableRefObject<HTMLInputElement>

    const dispatch: any = useDispatch()

    const userRegister = useSelector((state: any) => state.userRegister)

    const { userInfo, loading, error } = userRegister

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
        <C.Container>

            <div className='text'>

                <h1>Create Your Accont and Be Up to Date With New Animes!</h1>

                <ul>
                    <li>Favorite Your Animes, Mangas or Movies</li>
                    <li>Receive Notifications When A New Episodes Releases</li>
                    <li>Example</li>
                </ul>

            </div>


            <form onSubmit={(e) => formHandler(e)}>


                <h1>Register</h1>

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
                    {loading && (
                        <span>loading...</span>
                    )}
                    {error && (
                        <span>error: {error}</span>
                    )}
                </div>

                <div className='login'>
                    <Link to={`/login`}>Already have a Account? Click Here!</Link>
                </div>


            </form>



        </C.Container>
    )
}
