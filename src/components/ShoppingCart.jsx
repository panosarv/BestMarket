import {Offcanvas, Stack} from "react-bootstrap"
import Button from "@mui/material/Button"
import { useShoppingCart } from "../context/ShoppingCartContext"
import { NavLink } from "react-router-dom"
import { Nav } from "react-bootstrap"
import CartItem from "./CartItem"

function ShoppingCart({isOpen}){
    const {closeCart,cartItems,cartQuantity}=useShoppingCart()
    return(
        <Offcanvas show={isOpen} onHide={closeCart} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Your Cart:</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    {cartItems.map(item=>
                    (<CartItem key={item.id} {...item}/>))}
                    {cartQuantity>0&&<Nav.Link to="/checkout" as={NavLink}><Button style={{backgroundColor:"#5f816f",color:"white"}}>Calculate</Button></Nav.Link>||"Your cart is empty!"}
                    <Nav.Link to="/checkout" as={NavLink}></Nav.Link>
                </Stack>
                
            </Offcanvas.Body>
        </Offcanvas>
    )

}

export default ShoppingCart