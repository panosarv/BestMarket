import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useShoppingCart } from "../context/ShoppingCartContext"


function ProductCard(props){
    const {
        getItemQuantity,
        increaseCartQuantity,
       
    }= useShoppingCart()
    const quantity=getItemQuantity(props.id)
    let text;
    if (props.discount!==0){
        text=`Price: ${Math.round((props.price*(1-props.discount))*100)/100}$ DISCOUNT:${props.discount*100}%`
    }
    else{
        text=`Price: ${props.price}$`
    }
    return(
        
        <Card sx={{ maxWidth: 250 }}>
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
                    {props.name} : {props.price}$
                </Typography>
                <hr/>
                
                <Typography variant="body2" color="text.secondary" style={{alignText:"center"}}>{props.description}</Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" variant="contained" style={{backgroundColor:"#5f816f"}} className="add-to-cart" onClick={()=>increaseCartQuantity(props.id)}>
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    )
}

export default ProductCard

