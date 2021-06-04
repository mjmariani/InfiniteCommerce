import './homepage.css';
import NavBar from "./NavBar";
import Info from "./Info";
import MoreInfo from "./moreInfo";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import EditProfile from "./EditProfile";
import ProductPage from "./productPage";
import Description from "./description";
import { Route, Switch, Redirect, Link, BrowserRouter, useParams } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import CommerceAPI from "./api";
import useLocalStorage from "./localStorage";
import axios from 'axios';

function Home(){
    document.body.style.backgroundImage = "url('https://media.giphy.com/media/kG3EDN0eXqq4V1Pd6W/giphy.gif')";

    //using custom hook to use local Storage in order to store token
    //local storage uses key, value pairs to store objects
    const [token, setToken] = useLocalStorage('token', '');
    const [user, setUser] = useState({});
    const [shopCart, setShopCart] = useState([]);
    //to store item asin in filterCard to pass down to Description page
    const [itemIDDescription, setItemIDDescription] = useState("null");

    const itemsInCart = [];

    //setToken
    const saveToken = (token) => { setToken(token) };

    //setUser
    const saveUser = (user) => { setUser(user) };

    //add items to shopping cart piece of state
    const saveCart = (shopCart) => { setShopCart(shopCart) };

    //set item description id
    const setDescription = (itemIDDescription) => { setItemIDDescription(itemIDDescription) };

    // useEffect(()=>{ 

    // }, [itemIDDescription])

    //login
    const login = async (data) => {
        try{
            let res = await CommerceAPI.login(data);
            saveToken(res);
            let user = await CommerceAPI.getUserInfo(data.username);
            saveUser(user);
            return user;

        }catch(err){
            return <p>{err.message}</p>
        }
    }

    //register

    const register = async (data) => {
        try{
            let res = await CommerceAPI.register(data);
            saveToken(res);
            let user = await CommerceAPI.getUserInfo(data.username);
            saveUser(user);
            return user;

        }catch(err){
            return <p>{err.message}</p>
        }
    }

    //edit profile
    //returns user info
    const edit = async (data, username = user.username) => {
        try{
            let res = await CommerceAPI.edit(data, username);
            let user = await CommerceAPI.getUserInfo(username);
            saveUser(user);
            return user;

        }catch(err){
            return <p>{err.message}</p>
        }
        
    }


    // data = { {
    //             "position":1
    //             "title":"Convenient Operation 8pcs Anti Curling Carpet Tape Anti Slip Corners Edges Gripper Pads Kitchen Bathroom Blanket Non-Slip Sticker Reusable Grip Strong Gel (Color : B)"
    //             "asin":"B093GWTZSM"
    //             "link":"https://www.amazon.com/dp/B093GWTZSM"
    //             "categories":[...]
    //             "image":"https://m.media-amazon.com/images/I/41PRHKl2KiS._AC_UL320_.jpg"
    //             "is_prime":false
    //             "is_amazon_fresh":false
    //             "is_whole_foods_market":false
    //             "sponsored":false
    //             } }

    //add item to current shopping cart
    const handleAdd = async (store_name, asin, username = user.username, user_id = user.user_id ) => { 
        try{
            let res = await CommerceAPI.addItemToShoppingCart(username, user_id, store_name, asin);
            return res;
        }catch(err){
            return <p>{err.message}</p>
        }
    }

    //render Description page
    const renderDescriptionPage = async (asin) => {
        
            let item;
            // set up the request parameters
            
            const params = {
                api_key: "2D5E73AFE55F452888AC418D292FD570",
                type: "product",
                amazon_domain: "amazon.com",
                asin: `${asin}`,}
                //console.log(params)
            
            try{ 
                // make the http GET request to Rainforest API
            let res = await axios.get('https://api.rainforestapi.com/request', { params })
                
  
            // print the JSON response from Rainforest API
            //console.log(JSON.stringify(response.data, 0, 2));
            item = res.data;
            //console.log(item)
            return ( 
                <>
                    <Description handleAdd = {handleAdd} item = {item} />
                    //console.log("descr")
                </>
            )

            }catch(error){
                console.log(error);
            }

        }

    //delete item from current shopping cart
    const deleteItem = async (store_name, asin, username = user.username, user_id = user.user_id ) => {
        try{
            let res = await CommerceAPI.deleteItem(username, user_id, store_name, asin);
            return res;
        }catch(err){
            return <p>{err.message}</p>
        }
    }


    //checkout
    //returns obj of new shopping cart with all items in it which should be zero
    const checkout = async (username = user.username, user_id = user.user_id) => {
        try{
            let res = await CommerceAPI.checkout(username, user_id);
            return res;
        }catch(err){
            return <p>{err.message}</p>
        }
    }

    //update quantity for each item
    const updateQuantity = async (store_name, asin, quantity, username = user.username, user_id = user.user_id ) => {
        try{
            let res = await CommerceAPI.updateQuantity(username, user_id, store_name, asin, quantity);
            return res;
        }catch(err){
            return <p>{err.message}</p>
        }
    }

    //get all items in current shopping cart (also get quantity for each)
        //do a another external API call for each item to get image, price

    const getAllItemsInCart = async (username, user_id) => {
        try{
            let res = await CommerceAPI.getAllItemsInShoppingCart(username, user_id);
            //get asin number for each item
            
            let asin_nums_amazon = res.map((item) => {
                if(item.store_name == "Amazon"){
                    return item.asin;}
            });


            asin_nums_amazon.map((asin_num) => {
                
                    const params = {
                        api_key: "2D5E73AFE55F452888AC418D292FD570",
                        type: "product",
                        amazon_domain: "amazon.com",
                        asin: `${asin_num}`
                    }
    
                    axios.get('https://api.rainforestapi.com/request', { params })
                    .then(response => {
    
                    // print the JSON response from Rainforest API
                    //console.log(JSON.stringify(response.data, 0, 2));
                    //add items info to array
                    itemsInCart.push(response.data);

                    //add items to piece of state reserved for shopping cart
                    saveCart(itemsInCart);})})
                
                }
                    catch(error){

                    }}
            
            

                
            

    return( 
        <div className="Home">
            <BrowserRouter>
                <NavBar getAllItemsInCart={ getAllItemsInCart } checkout = {checkout} updateQuantity={updateQuantity} deleteItem = {deleteItem} cart = {shopCart} user = {user} />
                <Switch>
                    <Route exact path="/" >
                        <Info />
                    </Route>
                    <Route exact path="/info" >
                        <MoreInfo />
                    </Route>
                    <Route exact path="/signup" >
                        <SignUp register={register} />
                    </Route>
                    <Route exact path="/login" >
                        <LogIn login = {login} />
                    </Route>
                    <Route exact path="/profile" >
                        <EditProfile edit = {edit} />
                    </Route>
                    <Route exact path="/products" >
                        <ProductPage handleAdd = { handleAdd } setItemIDDescription = {setDescription} renderDescriptionPage = {(asin) => {renderDescriptionPage(asin)}}/>
                    </Route>
                    <Route exact path="/description" >
                        <Description itemIDDescription={itemIDDescription} handleAdd={handleAdd}/>
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    )
}

export default Home;