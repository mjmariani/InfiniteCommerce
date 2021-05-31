import './homepage.css';
import NavBar from "./NavBar";
import Info from "./Info";
import MoreInfo from "./moreInfo";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import EditProfile from "./EditProfile";
import { Route, Switch, Redirect, Link, BrowserRouter, useParams } from "react-router-dom";

function Home(){
    document.body.style.backgroundImage = "url('https://media.giphy.com/media/kG3EDN0eXqq4V1Pd6W/giphy.gif')";
    return( 
        <div className="Home">
            <BrowserRouter>
                <NavBar />
                <Switch>
                    <Route exact path="/" >
                        <Info />
                    </Route>
                    <Route exact path="/info" >
                        <MoreInfo />
                    </Route>
                    <Route exact path="/signup" >
                        <SignUp />
                    </Route>
                    <Route exact path="/login" >
                        <LogIn />
                    </Route>
                    <Route exact path="/profile" >
                        <EditProfile />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    )
}

export default Home;