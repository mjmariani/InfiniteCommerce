import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

class CommerceAPI {

    //token for interacting with the API
    static token;

    //Source: Springboard (Jobly Project)
    //leveraged as a helper method to make requests to node.js backend server
    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);
    
        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${CommerceAPI.token}` };
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

    //Returns { token }

    static async login(data) {
        let res = await this.request(`auth/token`, data, "post");
        return res.token;
    }

    /** Register */

    //Returns { token }

    static async register(data) {
        //console.log(data)
        let res = await this.request(`auth/register`, data, "post");
        return res.token;
    }

    /** Edit user profile. */

    //Returns { username, firstName, lastName, email, isAdmin }

    static async edit(data, username) {
        let res = await this.request(`users/${username}`, data, "patch");
        return res.user;
    }

      /** Get User Info. */

        //Returns { user_id, username, first_name, last_name, is_admin, shopping_cart_id }

    static async getUserInfo(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    /** Get all items in shopping cart for user */

    //Returns { [ {item_id, store_name, shopping_cart_id, asin }, ... ]} 

    static async getAllItemsInShoppingCart(username, user_id){
        let res = await this.request(`users/${username}/${user_id}/shoppingcart`);
        return res.items;
    }

    /** Add an item to shopping cart for user */

    //Returns { [ {item_id, store_name, shopping_cart_id, asin }, ... ]} (all items in current cart)

    static async addItemToShoppingCart(username, user_id, store_name, asin){
        let res = await this.request(`users/${username}/${user_id}/shoppingcart/${store_name}/${asin}`, {}, "post");
        return res.items;

    }

    /** Delete an item from shopping cart for user */

    //Returns { "successful" if successful, otherwise "not successful" }

    static async deleteItem(username, user_id, store_name, asin){
        let res = await this.request(`users/${username}/${user_id}/shoppingcart/${store_name}/${asin}`, {},"delete");
        return res.delete_item;
    }



    /** Checkout shopping cart for user */

    //Returns (new shopping cart with items in it) {items: [ {item_id, store_name, shopping_cart, asin }, ... ]}

    static async checkout(username, user_id){
        let res = await this.request(`users/${username}/${user_id}/shoppingcart`, {}, "post");
        return res.items;
    }

    /** Update quantity for an item for user */

    //Returns { [ {item_id, store_name, shopping_cart_id, asin, quantity }, ... ]}

    static async updateQuantity(username, user_id, store_name, asin, quantity){
        let res = await this.request(`users/${username}/${user_id}/shoppingcart/${asin}/${quantity}`, {}, "post");
        return res.items;
    }


}

export default CommerceAPI;