import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class CommerceAPI {

    //Source: Springboard (Jobly Project)
    //leveraged as a helper method to make requests to node.js backend server

    //static token;
    static async request(endpoint, token = "", data = {}, method = "get") {

        console.debug("API Call:", endpoint, data, method);
    
        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${token}` };
        const params = (method === "get")
            ? data
            : {};
    
        try {
        return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
        console.error("API Error:", err.response);
        let message = err.response.data.error.message;
        throw Array.isArray(message) ? message : [message];
        }
    }
    
    // Individual API routes

    /** Login */

    // Params { data }
    //Returns { token }

    static async login(data, token) {
        let res = await this.request(`auth/token`, token, data, "post");
        return res;
    }
    
    /** Register */

    // Params { data }
    //Returns { token }

    static async register(data, token) {
        //console.log(data)
        let res = await this.request(`auth/register`, token, data, "post");
        return res;
    }

    /** Edit user profile. */

    // Params { data, username }
    //Returns { username, first_name, last_name, email, isAdmin }

    static async edit(data, username, token) {
        let res = await this.request(`users/${username}`, token, data, "patch");
        return res;
    }

    /** Get User Info. */

        // Params { username }
        //Returns { user_id, username, first_name, last_name, is_admin, shopping_cart_id, email }

        static async getUserInfo(username, token) {
            let res = await this.request(`users/${username}`, token);
            return res;
        }

    /** Get all items in shopping cart for user */

    // Params { username, user_id }
    //Returns { [ {item_id, store_name, shopping_cart_id, asin }, ... ]} 

    static async getAllItemsInShoppingCart(username, user_id, token){
        let res = await this.request(`users/${username}/${user_id}/shoppingcart`, token);
        return res;
    }

    /** Add an item to shopping cart for user */

    //Params {username, user_id, store_name, asin}
    //Returns { [ {item_id, store_name, shopping_cart_id, asin }, ... ]} (all items in current cart)

    static async addItemToShoppingCart(username, user_id, store_name, asin, token){
        let res = await this.request(`users/${username}/${user_id}/shoppingcart/${store_name}/${asin}`, token, {}, "post");
        return res;

    }

    /** Delete an item from shopping cart for user */

    //Params {username, user_id, store_name, asin}
    //Returns { "successful" if successful, otherwise "not successful" }

    static async deleteItem(username, user_id, store_name, asin, token){
        let res = await this.request(`users/${username}/${user_id}/shoppingcart/${store_name}/${asin}`, token, {},"delete");
        return res;
    }

    /** Checkout shopping cart for user */

    //Params {username, user_id}
    //Returns (new shopping cart with items in it) {items: [ {item_id, store_name, shopping_cart, asin }, ... ]}

    static async checkout(username, user_id, token){
        let res = await this.request(`users/${username}/${user_id}/shoppingcart`, token, {}, "post");
        return res;
    }

    /** Update quantity for an item for user */

    //Params {username, user_id, store_name, asin, quantity}
    //Returns { [ {item_id, store_name, shopping_cart_id, asin, quantity }, ... ]}

    static async updateQuantity(username, user_id, store_name, asin, quantity, token){
        let res = await this.request(`users/${username}/${user_id}/shoppingcart/${asin}/${quantity}`, token, {}, "post");
        return res;
    }

}

export default CommerceAPI;