import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import "./EditProfile.css";

function Profile(){

    return( 
        <div class="edit-profile-form">
            <h2>Edit Profile</h2>
            <p></p>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="First Name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicText">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Last Name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                    I'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
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