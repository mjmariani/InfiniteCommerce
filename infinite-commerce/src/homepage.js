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
import { shoppingCartState, loginState } from "./features/userSlice";
//import useLocalStorage from "./localStorage";

function Home(){
    document.body.style.backgroundImage = "url('https://media.giphy.com/media/kG3EDN0eXqq4V1Pd6W/giphy.gif')";

    //get API Key
    const API_KEY = process.env.REACT_APP_RAINFOREST_API_KEY;

    //to use the redux dispatch method
    const dispatch = useDispatch();

    //to call the getUserInfoFromLocalStorage function only once
    useEffect(
        () => {
            getUserInfoFromLocalStorage()
        },[]);

    //get token from local storage. if it's in there then, store the data in the redux store
    const getUserInfoFromLocalStorage = () => {

    const userInfoLocalStorage = localStorage.getItem('user_data');
    const userCartInfoLocalStorage = localStorage.getItem('user_cart');
    let additionalUserCartInfoLocalStorage;
    if(localStorage.getItem('additional_cart_info')){
        additionalUserCartInfoLocalStorage = localStorage.getItem('additional_cart_info');
    }

    if(userInfoLocalStorage){
    //parse user data from JSON string to JS obj
    const parsedUserInfo = JSON.parse(userInfoLocalStorage);
    //update user state to login info from localStorage
    dispatch(
        loginState({
        username: parsedUserInfo.username,
        user_id: parsedUserInfo.user_id,
        first_name: parsedUserInfo.first_name,
        last_name: parsedUserInfo.last_name,
        is_admin: parsedUserInfo.is_admin, 
        shopping_cart_id: parsedUserInfo.shopping_cart_id,
        email: parsedUserInfo.email,
        token: parsedUserInfo.token,
        loggedIn: parsedUserInfo.loggedIn,
    })
    );
    }

    if(userCartInfoLocalStorage){
        //parse user data from JSON string to JS obj
        const parsedUserInfo = JSON.parse(userCartInfoLocalStorage);
        //update user cart from LocalStorage
        dispatch(shoppingCartState(parsedUserInfo));
        if(additionalUserCartInfoLocalStorage){
            const parsedAddCartData = JSON.parse(additionalUserCartInfoLocalStorage)
            changeCartData(parsedAddCartData);
        }
    }
    }

    //params for API call
    let params = {
        api_key: API_KEY,
        amazon_domain: "amazon.com",
    };
    const [cartData, setCartData] = useState([]);
    const changeCartData = (data) => {
        setCartData(data);
    }
    const [cartDone, setCartDone] = useState(true);

    const changeCartDoneFlag = () => {
        setCartDone(done => !done);
    }

    // //to store cart data
    // const [refreshCart, setRefreshCart] = useState(false);
    // //to monitor refresh cart state; if changed, then update the state of the homepage component    
    // useEffect(()=>{},[refreshCart]);
    return( 
        <div className="Home">
            <BrowserRouter>
                <NavBar params={params} changeCartData={(data) => changeCartData(data)} cartData={cartData} cartDone={cartDone} changeCartDone={()=> {changeCartDoneFlag()}} setCartDone={setCartDone}/>
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
                        <LogIn changeCartData={(data) => changeCartData(data)} cartData={cartData}/>
                    </Route>
                    <Route exact path="/profile" >
                        <EditProfile />
                    </Route>
                    <Route exact path="/products" >
                        <ProductPage params={params} changeCartData={(data) => changeCartData(data)} cartData={cartData} cartDone={cartDone} changeCartDone={()=> {changeCartDoneFlag()}} setCartDone={setCartDone}/>
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