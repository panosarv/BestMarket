import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useNavigate } from 'react-router-dom';
import "../styles/CategoryCard.css"; // Import the CSS file for additional styling
import { Category } from '@mui/icons-material';

function CategoryCard(props) {
    console.log('Product card props', props);
    const {
        getItemQuantity,
        increaseCartQuantity,
    } = useShoppingCart();
    const quantity = getItemQuantity(props.id);
    const navigate = useNavigate();
    const navigateToCategoryPage = () => {
        navigate(`/category/${props.categoryid}`);
    };

    return (
        <Card className="category-card" onClick={navigateToCategoryPage}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="200"
                    image={props.image}
                    alt="item image"
                    className="category-image"
                />
                <CardContent className="category-content">
                    <Typography gutterBottom variant="h6" component="div" className="category-name">
                        {props.name}
                    </Typography>
                    <hr />
                    <Typography variant="body2" color="text.secondary" className="category-description">
                        {props.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default CategoryCard;
