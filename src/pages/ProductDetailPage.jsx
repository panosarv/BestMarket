import React, { useEffect, useState } from 'react';
import data from '../data/items.json';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import { useShoppingCart } from "../context/ShoppingCartContext";
import '../styles/ProductDetailPage.css';

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const { increaseCartQuantity } = useShoppingCart();

  useEffect(() => {
    const product = data.find(item => item.id === Number(id));
    setProduct(product);
  }, []);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <Button size="small" variant="contained" style={{backgroundColor:"#5f816f"}} className="add-to-cart" onClick={() => increaseCartQuantity(product.id)}>
        Add to Cart
      </Button>
    </div>
  );
}

export default ProductDetailPage;