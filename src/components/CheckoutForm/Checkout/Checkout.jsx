import React,{useState, useEffect} from 'react'
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@material-ui/core'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import {commerce} from '../../../lib/commerce';
import {Link, useHistory} from 'react-router-dom';

import useStyles from './styles'

const steps = ['shipping address', 'payment details' ]; 

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({ });
    const [isFinished, setIsFinished] = useState(false);
    const classes = useStyles();
    const history  = useHistory();
    
    useEffect( () => {
        const generateToken = async () =>{
            try{
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'})
                setCheckoutToken(token)
            } catch (error){
                history.pushState( '/')
            }
        }
        generateToken();
    }, [cart])

    const nextStep = () => setActiveStep((prevActiveStep)=> prevActiveStep +1)    
    const backStep = () => setActiveStep((prevActiveStep)=> prevActiveStep -1)    


    const next = (data) =>{
        setShippingData(data);
        nextStep();
    }

    const timeOut = () =>{
        setTimeout (() => {
            setIsFinished(true)
        }, 3000)
    }

    let Confirmation = () => order.customer ? (
        <>
           <div>
               <Typography variant = "h5"> Thank You for your Purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
               <Divider className={classes.divider}/>
               <Typography variant = "subtitle2">order ref: {order.customer_reference}</Typography>
           </div>
           <br/>
           <Button component ={Link } to="/" variant = "outlined" type = "button"> Back to home 😍 </Button>
        </>
    ) : isFinished ? (
        <>
           <div>
               <Typography variant = "h5"> Thank You for your Purchase 😍</Typography>
               <Divider className={classes.divider}/>
           </div>
           <br/>
           <Button component ={Link } to="/" variant = "outlined" type = "button"> Back to home 😍 </Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress/>
        </div>
    );

    if (error){
        <>
          <Typography variant = "h5">Error : {error}</Typography>
          <br/>
          <Button component ={Link } to="/" variant = "outlined" type = "button"> Back to home 😍 </Button>
        </>
    }

    const Form =() => activeStep === 0 ? 
    <AddressForm checkoutToken={checkoutToken} next = {next} />: 
    <PaymentForm shippingData={shippingData} checkoutToken = {checkoutToken} backStep= {backStep} nextStep = {nextStep} onCaptureCheckout = {onCaptureCheckout} timeOut = {timeOut} />


    return (
        <>
        <CssBaseline/>
            <div className={classes.toolbar}/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center"> checkout </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step)=>(
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation/> :  checkoutToken && <Form/>}
                </Paper>
            </main>
        </>
    )
}

export default Checkout
