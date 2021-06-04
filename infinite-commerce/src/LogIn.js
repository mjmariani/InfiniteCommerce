import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import "./LogIn.css";
import React, {useState} from 'react';

function Login({login}){
    let [data, setData]=useState({});
    
    const handleChange = evt => {
        const { name, value } = evt.target;
        setData(fData => ({
        ...fData,
        [name]: value
        }));
    }

    const handleSubmit = async (data) => {
        try{
            await login(data);
            return <Redirect to="/" />
        }catch(err){
            
            return <p>{err.message}</p>
        }
    }


    return( 
        <div class="login-form">
            <h2>Login</h2>
            <p></p>
            <Form onSubmit={(evt)=> {evt.preventDefault(); handleSubmit(data)}}>
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
                
                <Button variant="primary" type="submit" id="button">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default Login;