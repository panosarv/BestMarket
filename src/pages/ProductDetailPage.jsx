import React, { useEffect, useState } from 'react';
import data from '../data/items.json';
import { useParams } from 'react-router-dom';
import { Button, Grid, TextField, Box } from '@mui/material'; // import Box for centering
import { useShoppingCart } from "../context/ShoppingCartContext";
import '../styles/ProductDetailPage.css';

function ProductDetailPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const { category: categoryParam } = useParams();
  const { getItemQuantity,increaseCartQuantity } = useShoppingCart();
  
  useEffect(() => {
    const categoryData = data.find(item => item.category === categoryParam);
    if (categoryData) {
      setProducts(categoryData.products);
      setCategory({ name: categoryData.name, image: categoryData.image, description: categoryData.description });
    }
  }, []);

  if (!products.length) {
    return <div>Loading...</div>;
  }

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className="product-detail"> {/* use Box for centering */}
      <img src={category.image} alt={category.name} />
      <h1>{category.name}</h1>
      <p>{category.description}</p>
      <TextField label="Search" variant="outlined" value={search} onChange={e => setSearch(e.target.value)} />
      <Grid container spacing={3}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box display="flex" flexDirection="column" height="100%"> {/* use Box with flex to ensure same height */}
              <div key={product.id}>
                <img src={product.image} alt={product.name} />
                <h1>{product.name}</h1>
                <Button size="small" variant="contained" style={{backgroundColor:"#5f816f"}} className="add-to-cart" onClick={(event)=>{event.stopPropagation(); increaseCartQuantity(product.id);}}>
                  Add to Cart
                </Button>
              </div>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductDetailPage;