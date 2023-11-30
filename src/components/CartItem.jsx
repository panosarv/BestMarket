import { Button, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";

function CartItem(props){
    const {removeFromCart}=useShoppingCart()
   
    

    return(
        <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
            <img src={props.image} alt="item-img" style={{width:"125px",height:"75px",
        objectFit:"cover"}} />
        <div className="me-auto">
            <div>{props.name} {props.quantity>1 && <span className="text-muted">x{props.quantity}</span>}
            </div>
        </div>
        <Button variant="outline-danger" size="sm" onClick={()=>removeFromCart(props.id)}>&times;</Button>
        </Stack>
    )
}

export default CartItem