import "./LogIn.css";
import AlertDismissible from "./AlertDismissible";
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import CommerceAPI from "./api";
import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import { loginState } from "./features/userSlice";

function Login(){

    let [data, setData]=useState({});

    let [errorFlag, setErrorFlag] = useState(false);

    const changeErrorFlag = () => {
        setErrorFlag(errorFlag => !errorFlag);
    }
    
    const handleChange = evt => {
        const { name, value } = evt.target;
        setData(fData => ({
        ...fData,
        [name]: value
        }));
    }

    

    //login
    const login = async (data) => {
        try{
            //debugger;
            let token = await CommerceAPI.login(data);
            
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
            return [token, user];

        }catch(err){
            changeErrorFlag();
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
            
            dispatch(
                loginState({
                username: userInfo[1].user.username,
                user_id: userInfo[1].user.user_id,
                first_name: userInfo[1].user.firstname,
                last_name: userInfo[1].user.lastname,
                is_admin: userInfo[1].user.isadmin, 
                shopping_cart_id: userInfo[1].user.shopping_cart_id,
                email: userInfo[1].user.email,
                token: userInfo[0].token,
                loggedIn: true,
            })
            );

            const user_data = {
                username: userInfo[1].user.username,
                user_id: userInfo[1].user.user_id,
                first_name: userInfo[1].user.firstname,
                last_name: userInfo[1].user.lastname,
                is_admin: userInfo[1].user.isadmin, 
                shopping_cart_id: userInfo[1].user.shopping_cart_id,
                email: userInfo[1].user.email,
                token: userInfo[0].token,
                loggedIn: true,
            }

            //put user info into local storage
            localStorage.setItem('user_data', JSON.stringify(user_data));

            // return <Redirect to="/products" />
            return history.push('/products'); //redirect to '/products' page using useHistory hook

        }catch(err){
            
            return <></>
        }
    }

    return(
        <>
        { errorFlag === true && <AlertDismissible msg={"Log In Error"}/>}
        <div class="login-form">
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
}

export default Login;