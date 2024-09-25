import { Offcanvas, Stack } from "react-bootstrap";
import Button from "@mui/material/Button";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import CartItem from "./CartItem";
import { useEffect, useRef, useState } from "react";

const isUserLoggedIn = () => {
    const token = sessionStorage.getItem('accesstoken');
    return !!token;
}

function ShoppingCart({ isOpen }) {
    const { closeCart, cartItems, cartQuantity } = useShoppingCart();
    const saveCartRef = useRef(null);
    const [searchButtonClassName, setSearchButtonClassName] = useState('search-button');
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        setSearchButtonClassName('disabled-save-button');
        console.log('Authorization', `${sessionStorage.getItem('accesstoken')}`);

        // Prepare cart data, including product quantities
        const cartData = cartItems.map(item => ({
            productid: item.productid,
            categoryid: item.categoryid,
            quantity: Number(item.quantity) || 1,  // Default to 1 if quantity is not provided
        }));

        const response = await fetch('https://bestmarket-server.onrender.com/api/saveCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': `${sessionStorage.getItem('accesstoken')}`,
            },
            body: JSON.stringify({
                cart: cartData,  // Send the cart data with quantities
            }),
        });

        if (response.ok) {
            console.log('Cart saved successfully');
        } else {
            console.error('Failed to save the cart');
        }

        setSearchButtonClassName('search-button');
        setIsLoading(false);
    };

    return (
        <Offcanvas show={isOpen} onHide={closeCart} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Your Cart:</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    {cartItems.map(item => (
                        <CartItem key={item.productid} {...item} />
                    ))}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {cartQuantity > 0 && (
                            <Nav.Link to="/checkout" as={NavLink}>
                                <Button
                                    onClick={closeCart}
                                    style={{ backgroundColor: "#5f816f", color: "white", marginRight: '1em' }}
                                >
                                    Calculate
                                </Button>
                            </Nav.Link>
                        )}
                        {cartQuantity > 0 && isUserLoggedIn() && (
                            <Button
                                style={{ backgroundColor: "#5f816f", color: "white", marginLeft: '1em' }}
                                onClick={handleClick}
                                disabled={isLoading}
                                className={searchButtonClassName}
                            >
                                Save cart
                            </Button>
                        )}
                    </div>
                    <Nav.Link to="/checkout" as={NavLink}></Nav.Link>
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default ShoppingCart;
