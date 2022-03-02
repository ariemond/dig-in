import React, {useState, useEffect} from 'react';
import fire from './config/fire';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Header from './components/Header/Header';
import SignUp from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import DinerForm from './components/DinerForm/DinerForm';
import ChefList from './components/ChefList/ChefList';
import ChefProfile from './components/ChefProfile/ChefProfile';
import EditProfile from './components/EditProfile/EditProfile';
import AddChef from './components/AddChef/AddChef';

function App(){
  const [user, setUser] = useState(null);
  const [listenerAdded, setListenerAdded] = useState(false);

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setUser(null);
        localStorage.removeItem('isAuthenticated');
      }
    });
      setListenerAdded(true);
  };

  useEffect(() => {
    if (!listenerAdded) {
      authListener();
    }
  }, [listenerAdded]);

  const handleLogin = (user) => {
    setUser(user);
  };

  
  function PrivateRoute({Component, ...rest}) {
    return <Route {...rest} render={(props) => (localStorage.isAuthenticated ? React.createElement(Component, {...props}) : <Redirect to="/login"/>)}/>;
  };

    return (
      <BrowserRouter>
        <div className="App">
          <Header user={user}/>
            <Switch>
              <Route path='/' exact component={SignUp}/>
              <Route path='/signup' component={SignUp}/>
              <Route path='/login' component={Login} handler={handleLogin}/>
              <PrivateRoute path='/diner' component={DinerForm} user={user}/>
              <PrivateRoute path='/chefs' exact component={ChefList}/>
              <PrivateRoute path="/chefs/:id" component={(routerProps) => <ChefProfile {...routerProps} user={user}/>}/>
              <PrivateRoute path="/editprofile" component={(routerProps) => <EditProfile {...routerProps} user={user}/>}/>
              <PrivateRoute path="/createprofile" component={(routerProps) => <AddChef {...routerProps} user={user}/>}/>
            </Switch>
          </div>
      </BrowserRouter>
  );
};


export default App
