import React, {useRef, useState} from 'react';
import '../Login/login.scss';
import {Link, useHistory} from 'react-router-dom';
import fire from '../../config/fire';


//To log in as a "diner"... email: hello@digin.com, password: 123456
//To log in as a chef... email: chefjoe@digin.com, password: 123456

function Login() {
    const email = useRef();
    const password = useRef();
    const history = useHistory();
    const [error, setError] = useState("");

    async function login(event) {
        event.preventDefault();
        try {
            setError("");
            await fire.auth().signInWithEmailAndPassword(email.current.value, password.current.value);
            history.push("/diner");
        } catch {
            setError("Failed log in.")
        };
    };

return (
    <section className="login">
        <div className="login__header">
            <h1 className="login__title">Stop going out.</h1>
            <h1 className="login__title2">Start digging in.</h1>
        </div>
        <div className="login__form-div">
            <h5 className="login__form-header">Log in to get started:</h5>
            <form className="login__form">
                <input 
                className="login__email-input" 
                type="text" 
                placeholder="Email" 
                name="email" 
                ref={email}/>
                <input 
                className="login__password-input"
                type="password" 
                placeholder="Password" 
                name="password" 
                ref={password}/>
                <button type="submit" onClick={login} className="login__button">Submit</button>
            </form>
        </div>  
        <div className="login__signup-div">
            <p className="login__signup">Don't have an account?</p>
            <Link to="/signup" className="login__signup-link"><p className="login__signup">Sign Up.</p></Link>
        </div>
        <p style={{color: "white"}}>{error}</p>
    </section>
    );
};


export default Login
