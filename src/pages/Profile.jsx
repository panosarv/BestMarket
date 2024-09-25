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
  const [userDetails, setUserDetails] = useState({
    id: '',
    username: '',
    email: '',
  });
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedCart, setSelectedCart] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [draggedCart, setDraggedCart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingCartId, setEditingCartId] = useState(null);
  const { getItemQuantity, increaseCartQuantity, clearCart } = useShoppingCart();
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
    fetchCartProducts();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('https://bestmarket-server.onrender.com/api/getUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionStorage.getItem('accesstoken'),
        },
      });
      const data = await response.json();
      setUserDetails(data.user);
      setNewUsername(data.user.username);
      setNewEmail(data.user.email);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchCartProducts = async () => {
    try {
      const response = await fetch('https://bestmarket-server.onrender.com/api/getCartProductsUserId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionStorage.getItem('accesstoken'),
        },
      });

      const data = await response.json();
      setCartProducts(data);
    } catch (error) {
      console.error('Error fetching cart products:', error);
    }
  };

  const handleSaveClick = async () => {
    if(newUsername === userDetails.username && newEmail === userDetails.email) {
      setEditMode(false);
      return;
    }
    if(!newUsername || !newEmail) {
      alert('Both Username and Email are required');
      return;
    }
    try {
      const response = await fetch('https://bestmarket-server.onrender.com/api/editUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionStorage.getItem('accesstoken'),
        },
        body: JSON.stringify({
          id: userDetails.id,
          username: newUsername,
          email: newEmail,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUserDetails({ ...userDetails, username: newUsername, email: newEmail });
        setEditMode(false);
      } else {
        console.error('Error updating user details:', data.message);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

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

  const handleCartClick = (cartId) => {
    setSelectedCart(selectedCart === cartId ? null : cartId);
    clearCart();
    const cart = cartProducts.find((cart) => cart.cartid === cartId);
    const { categories, products } = cart;
    for (let category of categories) {
      increaseCartQuantity(category);
    }
    for (let product of products) {
      for (product.quantity; product.quantity > 0; product.quantity--) {
        increaseCartQuantity(product);
      }
    }
    navigate('/checkout');
  };

  const handleDragStart = (event, cartId) => {
    setDraggedCart(cartId);
    setIsDragging(true);
  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedCart(null);
    setIsDragging(false);
  };

  const handleDrop = (event, targetCartId) => {
    event.preventDefault();
    if (draggedCart !== null && draggedCart !== targetCartId) {
      const targetCartIndex = cartProducts.findIndex((cart) => cart.cartid === targetCartId);
      const draggedCartIndex = cartProducts.findIndex((cart) => cart.cartid === draggedCart);
      if (targetCartIndex !== -1 && draggedCartIndex !== -1) {
        const userConfirmationWindow = window.confirm('Are you sure you want to merge the carts?');
        if (!userConfirmationWindow) return;

        let updatedProducts = [...cartProducts[targetCartIndex].products];

        cartProducts[draggedCartIndex].products.forEach(draggedProduct => {
          const existingProductIndex = updatedProducts.findIndex(product => product.productid === draggedProduct.productid);
          if (existingProductIndex !== -1) {
            updatedProducts[existingProductIndex].quantity += draggedProduct.quantity;
          } else {
            updatedProducts.push({ ...draggedProduct });
          }
        });

        let updatedCategories = [...cartProducts[targetCartIndex].categories];
        cartProducts[draggedCartIndex].categories.forEach(draggedCategory => {
          const categoryExists = updatedCategories.some(category => category.categoryid === draggedCategory.categoryid);
          if (!categoryExists) {
            updatedCategories.push(draggedCategory);
          }
        });

        setCartProducts(prevCartProducts => {
          const newCartProducts = [...prevCartProducts];
          newCartProducts[targetCartIndex] = {
            ...newCartProducts[targetCartIndex],
            products: updatedProducts,
            categories: updatedCategories,
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
  };

  const updateCartInDatabase = async (updatedCart) => {
    try {
      const response = await fetch('https://bestmarket-server.onrender.com/api/updateCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionStorage.getItem('accesstoken'),
        },
        body: JSON.stringify({ cart: updatedCart }),
      });

      const data = await response.json();
      console.log('Cart updated successfully:', data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItemFromCart = (cartId, item) => {
    if (editingCartId !== cartId) return; // Only allow removal from the currently edited cart

    const cartToUpdate = cartProducts.find(cart => cart.cartid === cartId);
    console.log(cartToUpdate);
    
    if(cartToUpdate && cartToUpdate.products.length === 1) {
      deleteCart(cartId); 
      toggleEditMode(cartId);
    } else if (cartToUpdate && cartToUpdate.products.length > 1) {
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

        if (updatedCategories.length === 0) {
          deleteCart(cartId);
        }
      }
    }
  };

  const deleteCart = async (cartId) => {
    const confirmation = window.confirm("Are you sure you want to delete this cart?");
    if (!confirmation) return;

    try {
      await fetch(`https://bestmarket-server.onrender.com/api/deleteCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionStorage.getItem('accesstoken'),
        },
        body: JSON.stringify({ cartid: cartId }),
      });

      setCartProducts(prevCartProducts => prevCartProducts.filter(cart => cart.cartid !== cartId));
      console.log("Cart deleted successfully");
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  };

  const deleteAllCarts = async () => {
    const confirmation = window.confirm("Are you sure you want to delete all carts?");
    if (!confirmation) return;

    try {
      await fetch(`https://bestmarket-server.onrender.com/api/deleteAllUserCarts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': sessionStorage.getItem('accesstoken'),
        },
        body: JSON.stringify({ userid: userDetails.id }),
      });

      setCartProducts([]);
      console.log("All carts deleted successfully");
    } catch (error) {
      console.error("Error deleting all carts:", error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('accesstoken');
    navigate('/account');
  };

  return (
    <div className='background-img'>
      <div className="profile-page">
        <Card className="mb-3">
          <Card.Header className='header-color'>Profile Information</Card.Header>
          <Card.Body>
            <Card.Title>
              {editMode ? (
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              ) : (
                userDetails.username
              )}
            </Card.Title>
            <Card.Text>
              {editMode ? (
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              ) : (
                userDetails.email
              )}
              <br />
            </Card.Text>
            <Button className='edit-btn' style={{marginRight:'0px'}} onClick={editMode ? handleSaveClick : handleEditClick}>
              {editMode ? 'Save' : 'Edit'}
            </Button>
            {cartProducts.length > 0 && (
              <Button
                className='delete-all-btn'
                style={{ float: 'right' }}  // Move button to the right
                onClick={deleteAllCarts}
              >
                Delete All Carts
              </Button>
            )}
            <Button className='logout-btn' onClick={logout}>Logout</Button>
          </Card.Body>
        </Card>
      </div>

      {cartProducts.length > 0 && (
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
                          <div style={{ display: 'flex', width: '10em', flexDirection: 'column', flexWrap: 'nowrap', height: '5em' }}>
                            <div style={{ overflow: 'hidden' }}>{product.name}</div>
                            <div>Quantity: {product.quantity}</div>
                          </div>
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
                  <Button className='delete-btn' onClick={() => deleteCart(cart.cartid)}>Delete Cart</Button>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </Card>
      )}
    </div>
  );
}

export default Profile;
