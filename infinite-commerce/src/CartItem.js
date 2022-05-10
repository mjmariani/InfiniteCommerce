import { Button } from "@material-ui/core";
import React from 'react';

import { Wrapper } from "./CartItem.styles.js";

const CartItem = ({ item, addToCart, removeFromCart }) => {
    return(
        <Wrapper>
            <div>
                <p>{item.title}</p>
                <div className="information">
                    <p>Price: ${item.price}</p>
                    <p>Total: ${item.total}</p>
                </div>
                <div className="buttons">
                    <Button
                    size="small"
                    disableElevation
                    variant="contained"
                    onClick={async () => await removeFromCart(item)}
                    >
                    -
                    </Button>
                    <p>{item.quantity}</p>
                    <Button
                    size="small"
                    disableElevation
                    variant="contained"
                    onClick={async () => await addToCart(item)}
                    >
                    +
                    </Button>
                </div>
            </div>
            <img src={item.image} alt={item.title} />
        </Wrapper>
        )
}

export default CartItem;