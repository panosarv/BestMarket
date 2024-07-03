import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useNavigate } from 'react-router-dom';
import "../styles/ProductCard.css"; // Import the CSS file for additional styling

function ProductCard(props) {
    console.log('Product card props', props);
    const {
        getItemQuantity,
        increaseCartQuantity,
    } = useShoppingCart();
    const quantity = getItemQuantity(props.id);
    const navigate = useNavigate();
    const navigateToProductPage = () => {
        navigate(`/subcategory/${props.categoryid}`);
    };

    return (
        <Card className="product-card" onClick={navigateToProductPage}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="200"
                    image={props.image}
                    alt="item image"
                    className="product-image"
                />
                <CardContent className="product-content">
                    <Typography gutterBottom variant="h6" component="div" className="product-name">
                        {props.name}
                    </Typography>
                    <hr />
                    <Typography variant="body2" color="text.secondary" className="product-description">
                        {props.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            
        </Card>
    );
}

export default ProductCard;
