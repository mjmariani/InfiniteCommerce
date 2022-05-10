import './moreInfo.css';
import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import { Tab, Col } from 'react-bootstrap'
import 'react-accessible-accordion/dist/fancy-example.css';

function MoreInfo(){

    return (
        <div className="moreInfo">
            <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1" >
                    <Col sm={4} >
                        <ListGroup className="centered">
                            <ListGroup.Item action href="#about">
                                About
                            </ListGroup.Item>
                            <ListGroup.Item action href="#step1">
                                Step 1
                            </ListGroup.Item>
                            <ListGroup.Item action href="#step2">
                                Step 2
                            </ListGroup.Item>
                            <ListGroup.Item action href="#profile">
                                Profile Update
                            </ListGroup.Item>
                            <ListGroup.Item action href="#shoppingcart">
                                Shopping Cart
                            </ListGroup.Item>
                            </ListGroup>
                    </Col>
                    <Col sm={8} >
                        <Tab.Content className="centered-tab">
                            <Tab.Pane eventKey="#about">
                                <p></p>
                                <p id='about_text'>This website was built using the React.js library on the front-end and using the express.js framework with the Node.js runtime on the back-end where one can search for any products on Amazon (ability to search other sites like Ebay will be added in the future). 
                                    The products searches are pulled using the Rainforest API. Once selected, then the products can be added to the shopping cart 
                                    and then checked out.
                                </p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="#step1"> 
                                <p></p>
                                <p id='about_text_sub'>Sign up for an account by clicking on sign up</p>        
                            </Tab.Pane>
                            <Tab.Pane eventKey="#step2">
                                <p></p>
                                <p id='about_text_sub'>Search for products to buy by clicking on Products link on the navbar</p>         
                            </Tab.Pane>
                            <Tab.Pane eventKey="#profile">
                                <p></p>
                                <p id='about_text_sub'>You can also update your profile once registered to the site</p>         
                            </Tab.Pane>
                            <Tab.Pane eventKey="#shoppingcart">
                            <p></p>
                                <p id='about_text_sub'>Click on the shopping cart icon to view your current shopping cart and checkout</p>         
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                
            </Tab.Container>
        </div> 
        )
}

export default MoreInfo;