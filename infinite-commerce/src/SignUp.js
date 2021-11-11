import "./SignUp.css";
import AlertDismissible from "./AlertDismissible";
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import CommerceAPI from "./api";
import { useHistory } from "react-router-dom";
import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import { loginState } from "./features/userSlice";

function SignUp(){

    let [data, setData]=useState({});

    let [errorFlag, setErrorFlag] = useState(false);

    const handleChange = evt => {
        const { name, value } = evt.target;
        setData(fData => ({
        ...fData,
        [`${name}`]: value
        }));
    }

    const changeErrorFlag = () => {
        setErrorFlag(errorFlag => !errorFlag);
    }

    //to use the redux dispatch method
    const dispatch = useDispatch();

    const history = useHistory();

    const handleSubmit = async (data) => {
        try{
            const userInfo = await register(data)

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
            debugger;

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
            return <p>{err.message}</p>
        }
    }

    const register = async (data) => {
        try{
            //debugger;
            let token = await CommerceAPI.register(data);

            //save token info in redux state
            dispatch(
                loginState({
                    username: data.username,
                    password: data.password,
                    token: token.token,
                    loggedIn: true,
                })
            )

            CommerceAPI.token = token.token;

            let user = await CommerceAPI.getUserInfo(data.username, token.token);

            return [token, user];

        }catch(err){
            changeErrorFlag();
            return <p>{err.message}</p>
        }
    }

    return(
        <>
        { errorFlag === true && <AlertDismissible msg={"Sign Up Error"}/>}
        <div className="sign-up-form">
            <h2>Sign Up!</h2>
            <p></p>
            <Form onSubmit={(evt)=> {evt.preventDefault(); handleSubmit(data)}}>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name = "username" value={data.username} placeholder="Username" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name = "firstName" value={data.first_name} placeholder="First Name" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" name = "lastName" value={data.last_name} placeholder="Last Name" onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name = "email" value={data.email} placeholder="Enter email" onChange={handleChange} />
                    <Form.Text className="text-muted">
                    I'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name = "password" value={data.password} placeholder="Password" onChange={handleChange}/>
                    <Form.Text className="text-muted">
                    I'll never share your password with anyone else.
                    </Form.Text>
                </Form.Group>
                
                <Button variant="primary" type="submit" id="button">
                    Sign Up
                </Button>
            </Form>
        </div>
        </>
    )
}

export default SignUp;