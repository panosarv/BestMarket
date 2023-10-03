import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Grid, TextField, Box } from '@mui/material'; // import Box for centering
import { useShoppingCart } from "../context/ShoppingCartContext";
import '../styles/ProductDetailPage.css';

function ProductDetailPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const { category: categoryId } = useParams(); // get the category id from the URL
  const { getItemQuantity,increaseCartQuantity } = useShoppingCart();
  
  useEffect(() => {

    if(categoryId){
    fetch(`http://localhost:3000/api/category/${categoryId}`)
      .then(response => response.json())
      .then(data => { 
        console.log(data[0]);
        setCategory(data[0]);
        
      });
  }
}, [categoryId]);

  useEffect(() => {
    console.log('useEffect triggered'); // add this line to check if the hook is being triggered multiple times
    if(categoryId){
    fetch(`http://localhost:3000/api/product/${categoryId}`)
      .then(response => response.json())
      .then(data => { 
        console.log(data);
        setProducts(data); // add each product to the products array
        
        
      });
  }
}, [categoryId]);
  
  if(!products || !category) {
    return (<div>Loading...</div>)
  }

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));



  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" className="product-detail"> {/* use Box for centering */}
      <img src={category.image} alt={category.name} />
      <h1>{category.name}</h1>
      <p>{category.description}</p>
      <TextField label="Search" variant="outlined" value={search} onChange={e => setSearch(e.target.value)} />
      {console.log("products: ",products)}  
      <Grid container spacing={3}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box display="flex" flexDirection="column" height="100%"> {/* use Box with flex to ensure same height */}
              <div key={product.productid}>
                <img src={product.image} alt={product.name} />
                <h1>{product.name}</h1>
                <Button size="small" variant="contained" style={{backgroundColor:"#5f816f"}} className="add-to-cart" onClick={(event)=>{event.stopPropagation(); increaseCartQuantity(product.productid);}}>
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