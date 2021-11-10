import './moreInfo.css';
import React from 'react';
import ReactDOM from 'react-dom';
import ListGroup from 'react-bootstrap/ListGroup'
import { Tab, Col, Row } from 'react-bootstrap'

import 'react-accessible-accordion/dist/fancy-example.css';

function MoreInfo(){

    return (
        <div class="moreInfo">
            
            <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1" >
                
                    <Col sm={4} >
                        <ListGroup class="centered">
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
                        <Tab.Content class="centered-tab">
                            <Tab.Pane eventKey="#about">
                                <p></p>
                                <p>This website is a site built using the React.js framework on the front-end and Node.js (express.js framework) on the back-end where one can search for any products on Amazon or Ebay. 
                                    The products searches are pulled using the Rainforest API. Once selected, then the products can be added to the shopping cart 
                                    and then checked-out.
                                </p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="#step1"> 
                                <p></p>
                                <p>Sign up for an account by clicking on sign up</p>        
                            </Tab.Pane>
                            <Tab.Pane eventKey="#step2">
                                <p></p>
                                <p>Search for products to buy by clicking on Products link on navbar</p>         
                            </Tab.Pane>
                            <Tab.Pane eventKey="#profile">
                                <p></p>
                                <p>You can also update your profile once registered to the site</p>         
                            </Tab.Pane>
                            <Tab.Pane eventKey="#shoppingcart">
                            <p></p>
                                <p>Click on the shopping cart icon to view your current shopping cart and checkout</p>         
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                
            </Tab.Container>
        </div> 
        )
}

export default MoreInfo;