import './homepage.css';
import NavBar from "./NavBar";
import Info from "./Info";
import MoreInfo from "./moreInfo";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import EditProfile from "./EditProfile";
import ProductPage from "./productPage";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import { loginState } from "./features/userSlice";
//import useLocalStorage from "./localStorage";

function Home(){
    document.body.style.backgroundImage = "url('https://media.giphy.com/media/kG3EDN0eXqq4V1Pd6W/giphy.gif')";

    //to use the redux dispatch method
    const dispatch = useDispatch();

    //to call the getUserInfoFromLocalStorage function only once
    useEffect(
        () => {
            getUserInfoFromLocalStorage()
        }, []);

    //get token from local storage. if it's in there then, store the data in the redux store
    const getUserInfoFromLocalStorage = () => {

    const getUserInfo = localStorage.getItem('user_data');

    if(getUserInfo){
    //parse user data from JSON string to JS obj
    const parsedUserInfo = JSON.parse(getUserInfo);

    //update user state to login info from localStorage
    dispatch(
        loginState({
        username: parsedUserInfo.username,
        user_id: parsedUserInfo.user_id,
        first_name: parsedUserInfo.firstname,
        last_name: parsedUserInfo.lastname,
        is_admin: parsedUserInfo.isadmin, 
        shopping_cart_id: parsedUserInfo.shopping_cart_id,
        email: parsedUserInfo.email,
        token: parsedUserInfo.token,
        loggedIn: parsedUserInfo.loggedIn,
    })
    );

    }
    
    }

    //to store cart data
    const [refreshCart, setRefreshCart] = useState(false);    

    return( 
        <div className="Home">
            <BrowserRouter>
                <NavBar refreshCart={refreshCart} setRefreshCart={() => setRefreshCart(false)}/>
                <Switch>
                    <Route exact path="/" >
                        <Info />
                    </Route>
                    <Route exact path="/info" >
                        <MoreInfo />
                    </Route>
                    <Route exact path="/signup" >
                        <SignUp />
                    </Route>
                    <Route exact path="/login" >
                        <LogIn />
                    </Route>
                    <Route exact path="/profile" >
                        <EditProfile />
                    </Route>
                    <Route exact path="/products" >
                        <ProductPage refreshCart={()=> setRefreshCart(!refreshCart)}/>
                    </Route>
                    {/* <Route exact path="/description" >
                        <Description />
                    </Route> */}
                </Switch>
            </BrowserRouter>
        </div>
    )
}

export default Home;