import React, { useState } from 'react';
import {auth} from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User Signed Up");
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in");
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <h2>Login / SignUp</h2>
            <form>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />    
                <br/>
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br/>
                <button onClick={handleLogin}>Login</button> 
                
                <button onClick={handleSignUp}>SignUp</button>
            </form>
        </div>
    );
};

export default Login;