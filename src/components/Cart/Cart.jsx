import React from 'react'
import {Container, Typography, Button, Grid} from '@material-ui/core';
import {Link} from 'react-router-dom';

import useStyles from "./styles.js"
import CartItem from './CartItem/CartItem'

const Cart = ({ cart, handleUpdateCart, handleRemoveCart, handleEmptyCart}) => {
    const classes = useStyles();
    
    const EmptyCart = () =>(
        <Typography variant = "subtitle1"> You have no items in your Cart
        <Link to="/" className={classes.link}> ---{'>'}{'>'}{'>'}Add some items soon!!! </Link>
        </Typography>
    );

    const FilledCart = ()=>(
        <>
           <Grid container spacing={3} >
               {cart.line_items.map((item) =>(
                   <Grid item xs={12} sm={4} key={item.id}>
                       <CartItem item={item} onUpdateCart={handleUpdateCart} onRemoveCart={handleRemoveCart}/>
                   </Grid>
               ))}
           </Grid>
           <div className={classes.cardDetails}>
               <Typography variant="h3">subtotal: {cart.subtotal.formatted_with_symbol}</Typography>
               <div>
                   <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty Cart </Button>
                   <Button component={Link} to= '/checkout' className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">Checkout </Button>
               </div>
           </div>
        </>
    )
    if (!cart.line_items) return 'Loading...';
    return (
        <Container>
            <div className={classes.toolbar}/>
            <Typography className={classes.title} variant = "h3" gutterBottom>Your shopping Cart</Typography>
             {!cart.line_items.length ? <EmptyCart  /> : <FilledCart  />} 
            
        </Container>
    )
}

export default Cart
