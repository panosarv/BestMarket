import {Offcanvas, Stack} from "react-bootstrap"
import Button from "@mui/material/Button"
import { useShoppingCart } from "../context/ShoppingCartContext"
import { NavLink } from "react-router-dom"
import { Nav } from "react-bootstrap"
import CartItem from "./CartItem"
import { useEffect, useRef, useState } from "react"
const isUserLoggedIn = () => {
    const token = localStorage.getItem('accesstoken');
    return !!token;
    }
    
function ShoppingCart({isOpen}){
    const {closeCart,cartItems,cartQuantity}=useShoppingCart()
    const saveCartRef = useRef(null);
    const [searchButtonClassName, setSearchButtonClassName] = useState('search-button');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleClick = async () => {
        setIsLoading(true);
        setSearchButtonClassName('disabled-save-button');
        console.log('Authorization', `${localStorage.getItem('accesstoken')}`);
        const response = await fetch('https://bestmarket-server.onrender.com/api/saveCart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('accesstoken')}`,
          },
          body: JSON.stringify({
            cart: cartItems,
            user: localStorage.getItem('userId'),
            
          })
        });
        setSearchButtonClassName('search-button');
      };
    return(
        <Offcanvas show={isOpen} onHide={closeCart} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Your Cart:</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    {cartItems.map(item=>
                    (<CartItem key={item.id} {...item}/>))}
                    <div style={{display:"flex",justifyContent:"center"}}>
                        {cartQuantity>0&&<Nav.Link to="/checkout" as={NavLink}><Button style={{backgroundColor:"#5f816f",color:"white",marginRight:'1em'}}>Calculate</Button></Nav.Link>||"Your cart is empty!"}
                        {cartQuantity>0&&isUserLoggedIn()&&<Button style={{backgroundColor:"#5f816f",color:"white",marginLeft:'1em'}} onClick={handleClick}>Save cart</Button>}
                    </div>
                    <Nav.Link to="/checkout" as={NavLink}></Nav.Link>
                </Stack>
               
            </Offcanvas.Body>
        </Offcanvas>
    )

}

export default ShoppingCart