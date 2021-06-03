import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import "./EditProfile.css";
import { Redirect } from "react-router-dom";
import React, {useState} from 'react';
function Profile({edit}){

    let [data, setData]=useState('');

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
            return <Redirect to="/" />
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
                    <Form.Control type="text" value={data.first_name} placeholder="First Name" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" value={data.last_name} placeholder="Last Name" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" value={data.email} placeholder="Enter email" onChange={handleChange} />
                    <Form.Text className="text-muted">
                    I'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={data.password} placeholder="Password" onChange={handleChange} />
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