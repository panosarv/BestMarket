import { Button, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import storeItems from "../data/items.json"

function CartItem(props){
    const {removeFromCart}=useShoppingCart()
    let item = storeItems.find(item => item.id===props.id)
    if(item==null){
        for (let i = 0; i < storeItems.length; i++) {
            const foundItem = storeItems[i].products.find(product => product.id === props.id);

            if(foundItem) {
                item = foundItem;
                break;
            }
        }
    }
    if(item==null)return null;
    

    return(
        <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
            <img src={item.image} alt="item-img" style={{width:"125px",height:"75px",
        objectFit:"cover"}} />
        <div className="me-auto">
            <div>{item.name} {props.quantity>1 && <span className="text-muted">x{props.quantity}</span>}
            </div>
        </div>
        <Button variant="outline-danger" size="sm" onClick={()=>removeFromCart(item.id)}>&times;</Button>
        </Stack>
    )
}

export default CartItem