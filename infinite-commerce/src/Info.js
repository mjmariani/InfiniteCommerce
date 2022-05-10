import './Info.css';
import { Button } from 'react-bootstrap'
import { Link } from "react-router-dom";

function Info(){

    return( 
        <div class="info">
            {/* <Helmet>
                <style>{'body { background-image: "url(\'https://media.giphy.com/media/kG3EDN0eXqq4V1Pd6W/giphy.gif\')"; } '}</style>
            </Helmet> */}
            <h1>Welcome to InfiniteCommerce!</h1><br/>
            <p>Click below for more info or sign up/login!</p>
            <Link to="/info">
            <Button variant="outline-primary">More Info!</Button>
            </Link>
        </div>
    )    
}

export default Info;