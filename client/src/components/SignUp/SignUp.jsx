import '../SignUp/signUp.scss';
import React, {useRef, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import fire from '../../config/fire';

function SignUp() {
    const email = useRef();
    const password = useRef();
    const history = useHistory();
    const [error, setError] = useState("");

    async function handleSignup(event) {
        event.preventDefault();
        try {
            setError("");
            await fire.auth().createUserWithEmailAndPassword(email.current.value, password.current.value);
            history.push("/diner");
        } catch {
            setError("Failed sign up.")
        };
    };

    return (
        <section className="signup">
            <div className="signup__header">
                <h1 className="signup__title">Stop going out.</h1>
                <h1 className="signup__title2">Start digging in.</h1>
            </div>
            <div className="signup__form-div">
                <h5 className="signup__form-header">Sign up to get started:</h5>
                <form onSubmit={handleSignup} className="signup__form">
                    <input 
                    className="signup__email-input" 
                    type="text" 
                    placeholder="Email" 
                    name="email" 
                    ref={email}/>
                    <input 
                    className="signup__password-input"
                    type="password" 
                    placeholder="Password" 
                    name="password" 
                    ref={password}/>
                    <button type="submit"  className="signup__button">Sign Up</button>
                </form>
            </div>  
            <div className="signup__signup-div">
                <p className="signup__signup">Already have an account?</p>
                <Link to="/login" className="signup__signup-link"><p className="signup__signup">Log In.</p></Link>
            </div>
            <p style={{color: "white"}}>{error}</p>
        </section>
    );
};

export default SignUp
