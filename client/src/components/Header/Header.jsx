import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import logo from '../../assets/logo/mainlogo.png';
import '../Header/header.scss';
import fire from '../../config/fire';

function Header(props) {

    const logout = () => {
        fire.auth().signOut();
        props.history.push('/');
    };


    return (
        <header className="header">
            <Link to="/" className="header__logo-link">
                <img className="header__logo-image" src={logo} alt="instock logo"/>
            </Link>
            {props.user ? <p className="header__user-email">Welcome {props.user.email}</p> : null }
            {!props.user ? null : 
                <nav role="navigation" className="navigation">
                    <div id="menuToggle">
                    <input type="checkbox" />
                    <span></span>
                    <span></span>
                    <span></span>
                    <ul id="menu">
                        <Link to="/"><li className="navigation__list-item">Home</li></Link>
                        <Link to="/diner"><li className="navigation__list-item">Find a Chef</li></Link>
                        <Link to={`/createprofile`}><li className="navigation__list-item">Create Profile</li></Link>
                        <Link to={`/editprofile`}><li className="navigation__list-item">Edit Profile</li></Link>
                        <li onClick={logout} className="navigation__list-item">Logout</li>
                    </ul>
                    </div>
                </nav> 
            }
        </header>
    );
};
        

export default withRouter(Header)
