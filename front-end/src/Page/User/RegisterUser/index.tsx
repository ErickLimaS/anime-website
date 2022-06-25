import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { AnyAction, Dispatch } from 'redux';
import { registerUser } from '../../../redux/actions/userActions';
import * as C from './styles'

export default function RegisterUser() {


    const name = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const email = React.useRef() as React.MutableRefObject<HTMLInputElement>
    const password = React.useRef() as React.MutableRefObject<HTMLInputElement>

    const dispatch: any = useDispatch()

    const formHandler = (e: React.FormEvent) => {

        e.preventDefault()


        dispatch(registerUser(name.current.value, email.current.value, password.current.value))

    }

    return (
        <C.Container>

            <form onSubmit={(e) => formHandler(e)}>

                <div>
                    <label htmlFor='name'>Name</label>
                    <input type='text' id='name' placeholder='name' ref={name}></input>
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input type='email' id='email' placeholder='Email' ref={email}></input>
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' placeholder='Password' ref={password}></input>
                </div>

                <div>
                    <label htmlFor='submit'>Register</label>
                    <button type='submit' id='submit' >Register</button>
                </div>


            </form>


        </C.Container>
    )
}
