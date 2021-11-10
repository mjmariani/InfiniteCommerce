import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import "./EditProfile.css";
import { Redirect } from "react-router-dom";
import React, {useState} from 'react';
import CommerceAPI from "./api";
import {useSelector, useDispatch} from "react-redux";
import {selectUser, logoutState} from "./features/userSlice";
import { loginState } from "./features/userSlice";

function Profile(){

    let [data, setData]=useState({});

    const dispatch = useDispatch();

    //user info
    const userState = useSelector(selectUser)

    const handleChange = evt => {
        const { name, value } = evt.target;
        setData(fData => ({
        ...fData,
        [`${name}`]: value
        }));
    }

    const handleSubmit = async (data) => {
        try{
            await edit(data)
            return <Redirect to="/products" />
        }catch(err){
            return <p>{err.message}</p>
        }
    }

    //edit profile
    //returns user info
    //username comes from redux userState store
    const edit = async (data, username = userState.username) => {
        try{
            let res = await CommerceAPI.edit(data, username, userState.token);

            let user = await CommerceAPI.getUserInfo(username, userState.token);

            dispatch(
                loginState({
                    username: user.user.username,
                    user_id: user.user.user_id,
                    first_name: user.user.first_name,
                    last_name: user.user.last_name,
                    is_admin: user.user.is_admin, 
                    shopping_cart_id: user.user.shopping_cart_id,
                    email: user.user.email,
                    token: userState.token,
                    loggedIn: true,
            })
            );

            const user_data = {
                username: user.user.username,
                user_id: user.user.user_id,
                first_name: user.user.first_name,
                last_name: user.user.last_name,
                is_admin: user.user.is_admin, 
                shopping_cart_id: user.user.shopping_cart_id,
                email: user.user.email,
                token: userState.token,
                loggedIn: true,
            }

            //put user info into local storage
            localStorage.setItem('user_data', JSON.stringify(user_data));
            //saveUser(user);
            return;

        }catch(err){
            return <p>{err.message}</p>
        }
        
    }

    return(
        <div class="edit-profile-form">
            <h2>Edit Profile</h2>
            <p></p>
            <Form onSubmit={(evt)=> {evt.preventDefault(); handleSubmit(data)}}>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name = "first_name" value={data.first_name} placeholder={(userState) ? userState.first_name : "FirstName"} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" name = "last_name" value={data.last_name} placeholder={(userState) ? userState.last_name : "Last Name"} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name = "email" value={data.email} placeholder={(userState) ? userState.email : "Email"} onChange={handleChange} />
                    <Form.Text className="text-muted">
                    I'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name = "password" value={data.password} placeholder="Password" onChange={handleChange} />
                    <Form.Text className="text-muted">
                    I'll never share your password with anyone else.
                    </Form.Text>
                </Form.Group>
                
                <Button variant="primary" type="submit" id="button">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default Profile;