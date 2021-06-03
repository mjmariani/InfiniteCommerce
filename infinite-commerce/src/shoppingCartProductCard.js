import "./shoppingCartProductCard.css";


function ShoppingCartProductCard({item}){

    return ( 
        <div className="shoppingCartProductCard">
            <div>
                <img src={`${item.product.images[0].link}`} />
                <h3>{item.product.title}</h3>
            </div>
        </div>
    )
}

export default ShoppingCartProductCard;