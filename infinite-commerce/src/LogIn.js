import "./LogIn.css";
import AlertDismissible from "./AlertDismissible";
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useHistory, Redirect } from "react-router-dom";
import CommerceAPI from "./api";
import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { shoppingCartState, loginState, selectUser } from "./features/userSlice";

function Login({cartData, changeCartData}){

    const [data, setData]=useState({});

    const [errorFlag, setErrorFlag] = useState(false);

    const changeErrorFlagTrue = () => {
        setErrorFlag(true);
    }

    const changeErrorFlagFalse = () => {
        setErrorFlag(false);
    }
    
    const handleChange = evt => {
        const { name, value } = evt.target;
        setData(fData => ({
        ...fData,
        [name]: value
        }));
    }

    //variable used to check if user is logged in
    const userLoggedIn = useSelector(selectUser);

    //login
    const login = async (data) => {
        try{
            //debugger;
            let token = await CommerceAPI.login(data);
            //console.log(token);
            //save token info in redux state
            dispatch(
                loginState({
                    username: data.username,
                    password: data.password,
                    token: token.token,
                    loggedIn: true,
                })
            )

            let user = await CommerceAPI.getUserInfo(data.username, token.token);
            let cart = await CommerceAPI.getAllItemsInShoppingCart(user.user.username, user.user.user_id, token.token);
            
            //if login, then refresh cart below
            return [token, user, cart];

        }catch(err){
            changeErrorFlagTrue();
            return <></>;
        }
    }

    //to use the redux dispatch method
    const dispatch = useDispatch();

    const history = useHistory();
    
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try{
            
            const userInfo = await login(data);
            changeErrorFlagFalse();
            dispatch(
                loginState({
                username: userInfo[1].user.username,
                user_id: userInfo[1].user.user_id,
                first_name: userInfo[1].user.first_name,
                last_name: userInfo[1].user.last_name,
                is_admin: userInfo[1].user.is_admin, 
                shopping_cart_id: userInfo[1].user.shopping_cart_id,
                email: userInfo[1].user.email,
                token: userInfo[0].token,
                loggedIn: true,
            })
            );

            const user_data = {
                username: userInfo[1].user.username,
                user_id: userInfo[1].user.user_id,
                first_name: userInfo[1].user.first_name,
                last_name: userInfo[1].user.last_name,
                is_admin: userInfo[1].user.is_admin, 
                shopping_cart_id: userInfo[1].user.shopping_cart_id,
                email: userInfo[1].user.email,
                token: userInfo[0].token,
                loggedIn: true,
            }

            const user_cart = userInfo[2];
            dispatch(shoppingCartState(userInfo[2]));
            //put user info into local storage
            localStorage.setItem('user_data', JSON.stringify(user_data));
            //put user cart into local storage
            localStorage.setItem('user_cart', JSON.stringify(user_cart));
            if(localStorage.getItem('additional_cart_info')){
                const additionalUserCartInfoLocalStorage = localStorage.getItem('additional_cart_info');
                const parsedAddCartData = JSON.parse(additionalUserCartInfoLocalStorage)
                changeCartData(parsedAddCartData);
            }
            //return <Redirect to="/products" />
            return history.push('/products'); //redirect to '/products' page using useHistory hook
        }catch(err){
            changeErrorFlagTrue();
            return <></>
        }
    }

    if(!userLoggedIn){
        return(
            <>
            { errorFlag === true && <AlertDismissible msg={"Log In Error"}/>}
            <div className="login-form">
                <h2>Login</h2>
                <p></p>
                <Form onSubmit={(evt)=>{handleSubmit(evt)}}>
                    <Form.Group className="mb-3" controlId="formBasicText">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name= "username" value={data.username} placeholder="Username" onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name= "password" value={data.password} placeholder="Password" onChange={handleChange} />
                        <Form.Text className="text-muted">
                        I'll never share your password with anyone else.
                        </Form.Text>
                    </Form.Group>
                    
                    <Button variant="primary" id="button" type="submit">
                        Login
                    </Button>
                </Form>
            </div></>
        )
    }else{
        return <Redirect to="/info" />;
    }
}

export default Login;