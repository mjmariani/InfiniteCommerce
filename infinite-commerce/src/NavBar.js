import "./NavBar.css";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from 'react-bootstrap'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import {useSelector, useDispatch} from "react-redux";
import {selectUser, logoutState} from "./features/userSlice";
import SideDrawer from "./SideDrawer";

function NavBar({params, cartData, changeCartData}){

    //variable used to check if user is logged in
    const userLoggedIn = useSelector(selectUser);

    const dispatch = useDispatch();

    const userState = useSelector(selectUser);

    const history = useHistory();

    //logout
    const handleLogout = (evt) => {
      evt.preventDefault();
      
      dispatch(logoutState())
      // return <Redirect to="/info" />
      return history.push('/info'); //redirect to '/info' page
  }

  const [sideToggle, setSideToggle] = useState(false);


    return(
        <div>
          { (!userLoggedIn) ? 
            <><Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand as={Link} to="/" className="navLogo">InfiniteCommerce</Navbar.Brand>

              <Nav className="ml-12 nav">
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                <Nav.Link as={Link} to="/info">Info</Nav.Link>
              </Nav>

            </Container>
          </Navbar><br /></> :
          <><Navbar bg="dark" variant="dark">
          <Container>
          <Navbar.Brand as={Link} to="/" className="navLogo">InfiniteCommerce</Navbar.Brand>

          <Nav className="ml-12 nav">
            <Nav.Link as={Link} to="/profile">Logged in as: {userState.username}  </Nav.Link>
            <Nav.Link as={Link} onClick={(evt) => handleLogout(evt)} to="/info">Logout</Nav.Link>
            <Nav.Link as={Link} to="/info">Info</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link to=""><ShoppingBasketIcon fontSize='small' htmlColor='white' className="cart" onClick={() => setSideToggle(!sideToggle)}/></Nav.Link>
            <SideDrawer show={sideToggle} click={() => setSideToggle(!sideToggle)} params={params} changeCartData={(data) => changeCartData(data)} cartData={cartData} /> 
          </Nav>
          </Container>
          </Navbar><br /></>
        }
        </div>
        );
}

export default NavBar;