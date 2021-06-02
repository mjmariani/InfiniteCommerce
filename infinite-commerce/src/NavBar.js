import React, { useContext } from "react";
import "./NavBar.css";
import { NavLink, Link } from "react-router-dom";
//import { Navbar, Nav, NavItem, Container } from "reactstrap";
import userContext from "./userContext"
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { Navbar, Container, Nav } from 'react-bootstrap'
import { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {IconButton} from '@material-ui/core'
import ShoppingCartProductCard from "./shoppingCartProductCard";
import { SvgIcon } from '@material-ui/core';
import { Drawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

//Source: https://material-ui.com/components/drawers/#temporary-drawer

function NavBar(){
    const useStyles = makeStyles({
        list: {
          width: 250,
        },
        fullList: {
          width: 'auto',
        },
      });
      
      const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });
const [check, setCheck] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
    setCheck(prevCheck => !prevCheck);
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    ><ShoppingBasketIcon />
      <List>
        //implement shopping cart by looping through shoppingproduct card and making calls to db to get items
        
      </List>
    </div>
  );

    
    return(
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                <Navbar.Brand as={Link} to="/" className="navLogo">InfiniteCommerce</Navbar.Brand>
                <Nav className="ml-12 nav">
                <Nav.Link as={Link} to="/info">Info</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/products">Products</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link onClick={toggleDrawer('right', true)}><ShoppingBasketIcon fontSize='small' htmlColor='white' className="cart" /></Nav.Link>
                </Nav>
                </Container>
            </Navbar>
            <br />
            <div>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                    {list(anchor)}
                </Drawer>
                </React.Fragment>
            ))}
            </div>
        </div>);
 
}

export default NavBar;