import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useShoppingCart } from "../context/ShoppingCartContext"
import { useNavigate } from 'react-router-dom'; // Use useHistory instead of withRouter

function ProductCard(props){
    console.log('Product card props', props)
    const {
        getItemQuantity,
        increaseCartQuantity,
    }= useShoppingCart()
    const quantity=getItemQuantity(props.id)
   

    const navigate = useNavigate(); 
    const navigateToProductPage = () => { 
        navigate(`/category/${props.categoryid}`);
    };

    return(
        <Card sx={{ maxWidth: { xs: 'none', md: 400 } }} onClick={navigateToProductPage}> 
            <CardActionArea>
                <CardMedia
                component="img"
                height="200"
                image={props.image}
                alt="item image"
                className="product-image"
                />
                <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {props.name} 
                </Typography>
                <hr/>
                
                <Typography variant="body2" color="text.secondary" style={{alignText:"center"}}>{props.description}</Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" variant="contained" style={{backgroundColor:"#5f816f"}} className="add-to-cart" onClick={(event)=>{event.stopPropagation(); increaseCartQuantity(props);}}>
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    )
}

export default ProductCard;