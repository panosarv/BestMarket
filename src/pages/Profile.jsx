import React, { useEffect, useState } from 'react';
import { Card, Button, Stack } from 'react-bootstrap';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [draggedCart, setDraggedCart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingCartId, setEditingCartId] = useState(null);
  const { getItemQuantity, increaseCartQuantity, clearCart } = useShoppingCart();
  
  const navigate = useNavigate();

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const toggleEditMode = (cartId) => {
    if (editingCartId === cartId) {
      updateCartInDatabase(cartProducts.find(cart => cart.cartid === cartId));
      setEditingCartId(null);
    } else {
      setEditingCartId(cartId);
    }
  };

  const handleDragStart = (event, cartId) => {
    setDraggedCart(cartId);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedCart(null);
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const updateCartInDatabase = async (updatedCart) => {
    try {
      const response = await fetch('https://bestmarket-server.onrender.com/api/updateCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accesstoken'),
        },
        body: JSON.stringify({ cart: updatedCart }),
      });

      const data = await response.json();
      console.log('Cart updated successfully:', data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleDrop = (event, targetCartId) => {
    event.preventDefault();
    if (draggedCart !== null && draggedCart !== targetCartId) {
      const targetCartIndex = cartProducts.findIndex((cart) => cart.cartid === targetCartId);
      const draggedCartIndex = cartProducts.findIndex((cart) => cart.cartid === draggedCart);
      if (targetCartIndex !== -1 && draggedCartIndex !== -1) {
        const userConfirmationWindow = window.confirm('Are you sure you want to merge the carts?');
        if (!userConfirmationWindow) {
          return;
        }
        let updatedCategories = [...cartProducts[targetCartIndex].categories];
        let updatedProducts = [...cartProducts[targetCartIndex].products];
        
        cartProducts[draggedCartIndex].categories.forEach(draggedCategory => {
          const categoryExists = updatedCategories.some(category => category.categoryid === draggedCategory.categoryid);
          if (!categoryExists) {
            updatedCategories.push(draggedCategory);
          }
        });

        cartProducts[draggedCartIndex].products.forEach(draggedProduct => {
          const productExists = updatedProducts.some(product => product.productid === draggedProduct.productid);
          if (!productExists) {
            updatedProducts.push(draggedProduct);
          }
        });

        setCartProducts(prevCartProducts => {
          const newCartProducts = [...prevCartProducts];
          newCartProducts[targetCartIndex] = {
            ...newCartProducts[targetCartIndex],
            categories: updatedCategories,
            products: updatedProducts,
          };
          return newCartProducts;
        });

        const updatedCart = {
          cartid: targetCartId,
          categories: updatedCategories,
          products: updatedProducts,
        };
        updateCartInDatabase(updatedCart);
      }
    }
    setDraggedCart(null);
    setIsDragging(false);
  };

  const removeItemFromCart = (cartId, item) => {
    if (editingCartId !== cartId) return; // Only allow removal from the currently edited cart

    console.log(item);
    const cartToUpdate = cartProducts.find(cart => cart.cartid === cartId);

    if (cartToUpdate) {
      if (item.productid) {
        const updatedProducts = cartToUpdate.products.filter(product => product.productid !== item.productid);
        const updatedCart = {
          ...cartToUpdate,
          products: updatedProducts,
        };
        setCartProducts(prevCartProducts => prevCartProducts.map(cart => cart.cartid === cartId ? updatedCart : cart));
      } else {
        const updatedCategories = cartToUpdate.categories.filter(category => category.categoryid !== item.categoryid);
        const updatedCart = {
          ...cartToUpdate,
          categories: updatedCategories,
        };
        setCartProducts(prevCartProducts => prevCartProducts.map(cart => cart.cartid === cartId ? updatedCart : cart));
      }
    }
  };

  const handleCartClick = (cartId) => {
    setSelectedCart(selectedCart === cartId ? null : cartId);
    clearCart();
    const cart = cartProducts.find((cart) => cart.cartid === cartId);
    const { categories, products } = cart;
    for (let category of categories) {
      increaseCartQuantity(category);
    }
    for (let product of products) {
      increaseCartQuantity(product);
    }
    navigate('/checkout');
  };

  const fetchCartProducts = async () => {
    try {
      const response = await fetch('https://bestmarket-server.onrender.com/api/getCartProductsUserId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('accesstoken'),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart products');
      }

      const data = await response.json();
      console.log('data:', data);
      setCartProducts(data);
    } catch (error) {
      console.error('Error fetching cart products:', error);
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  return (
    <div className='background-img'>
      <div className="profile-page">
        <Card className="mb-3">
          <Card.Header className='header-color'>Profile Information</Card.Header>
          <Card.Body>
            <Card.Title>{editMode ? <input type="text" defaultValue="John Doe" /> : 'John Doe'}</Card.Title>
            <Card.Text>
              {editMode ? <input type="email" defaultValue="john.doe@example.com" /> : 'john.doe@example.com'}
              <br />
              {editMode ? <input type="password" defaultValue="******" /> : '******'}
            </Card.Text>
            <Button onClick={handleEditClick}>{editMode ? 'Save' : 'Edit'}</Button>
          </Card.Body>
        </Card>

        <Card className='mb-3'>
          <Card.Header className='header-color'>Current Location</Card.Header>
          <Card.Body>
            <p>Address: 123 Main St</p>
          </Card.Body>
        </Card>
      </div>
      <Card className="mb-3">
        <Card.Header className='header-color-secondary'>Saved Carts</Card.Header>
        {cartProducts.map((cart, index) => (
          <Accordion key={index}
            draggable
            onDragStart={(event) => handleDragStart(event, cart.cartid)}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDrop={(event) => handleDrop(event, cart.cartid)}
            className={isDragging && cart.cartid !== draggedCart ? 'drag-highlight' : ''}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography>Cart {index + 1}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className='cart-item-container'>
                <Stack direction="horizontal" gap={2} className="d-flex align-items-center overflow-auto">
                  {cart.categories.map((category) => (
                    <div key={category.categoryid}>
                      <img src={category.image} alt="item-img" style={{ width: "125px", height: "75px", objectFit: "cover" }} />
                      <div className="me-auto">
                        <div>{category.name}</div>
                        {editingCartId === cart.cartid && (
                          <button className='remove-item-btn' onClick={() => removeItemFromCart(cart.cartid, category)}>X</button>
                        )}
                      </div>
                    </div>
                  ))}
                  {cart.products.map((product) => (
                    <div key={product.productid}>
                      <img src={product.image} alt="item-img" style={{ width: "125px", height: "75px", objectFit: "cover" }} />
                      <div className="me-auto">
                        <div>{product.name}</div>
                        {editingCartId === cart.cartid && (
                          <button className='remove-item-btn' onClick={() => removeItemFromCart(cart.cartid, product)}>X</button>
                        )}
                      </div>
                    </div>
                  ))}
                </Stack>
              </Typography>
              <div className='btn-container'>
                {!editingCartId && (
                  <Button className='select-btn' onClick={() => handleCartClick(cart.cartid)}>Select</Button>
                )}
                {(!editingCartId || editingCartId === cart.cartid) && (
                  <Button className='edit-btn' onClick={() => toggleEditMode(cart.cartid)}>
                    {editingCartId === cart.cartid ? 'Done' : 'Edit'}
                  </Button>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </Card>
    </div>
  );
}

export default Profile;
