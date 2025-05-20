import React, { useState,useEffect } from 'react';
import {
  Box, Typography, Paper, Divider, Button, Avatar, TextField, IconButton, ButtonBase,
} from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Add, Remove } from '@mui/icons-material';
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';

function CartPage({ isNavOpen }) {

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const userRedux = useSelector((state) => state.user.user);
  const isloggedin = useSelector((state) => state.user.isLoggedin);


  //fetch from databases
  const [fetchitem, setfetchitem] = useState({items: []});
  const [storeInfo,setstoreInfo] = useState({area:" "});
  useEffect(() => {
    const fetchCart = async () => {
      if(!isloggedin){
        return;
      }
      try {
        const response = await axios.get(`${apiBaseUrl}/api/cart/${userRedux._id}`);
        if (response.data.carts.length === 0) {
          setfetchitem(null); // Set fetchitem to null if the cart is empty
        }
        else{
          setfetchitem(response.data.carts[0]);
          const storeresponse = await axios.get(`${apiBaseUrl}/api/store/${response.data.carts[0].items[0].store}`);
          setstoreInfo(storeresponse.data.store);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    // console.log(fetchitem); 
    // console.log(storeInfo);
  }, [fetchitem,storeInfo]);

  const createFullAddress = (address) => {
    if (!address) return ""; 

    const addressParts = [];

    if (address?.house_no) addressParts.push(address.house_no);
    if (address?.street) addressParts.push(address.street + " Street");
    if (address?.area) addressParts.push(address.area);
    if (address?.city) addressParts.push(address.city);
    if (address?.state) addressParts.push(address.state);
    if (address?.country) addressParts.push(address.country);
    if (address?.pincode) addressParts.push(address.pincode);

    return addressParts.join(', ') || ""; 
  };

  const fullAddress = createFullAddress(userRedux?.address);

  const user = { name: userRedux.name, mobile: userRedux.phone_number || "", address: fullAddress};

  const platformFees = 20; // Static example, can be dynamic
  const gst = 0.18; // 18% GST
  const deliveryCharges = 40; // Static example, can be dynamic
  const deliveryTip = 15; // Static example, can be dynamic

  var totalBill = fetchitem?.items.reduce((total, item) => total + item.item_price * item.item_quantity, 0);
  const gstAmount = totalBill * gst;
  var finalTotal = totalBill + platformFees + gstAmount + deliveryCharges + deliveryTip;

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState(user.address);

  const handleEditAddress = () => {
    setIsEditingAddress(!isEditingAddress);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  
  //updatecarts
  const updateCartInDB = async (updatedItems) => {
    try {
        if(updatedItems.length==0){
          await axios.delete(`${apiBaseUrl}/api/cart/delete/${fetchitem.id}`);
        }
        else{
        await axios.put(`${apiBaseUrl}/api/cart/update/${fetchitem.id}`, {
        items: updatedItems,
        totalAmount: totalBill,
        });} 
    } catch (err) {
      console.error('Error updating cart:', err);
    }
  };


  //increseitem with db
  const increaseQuantity = (index) => {
    const updatedItems = {...fetchitem};
    updatedItems.items[index].item_quantity += 1;

    setfetchitem(updatedItems);

    updateCartInDB(updatedItems.items);
  };

  //decreaseitem with db
  const decreaseQuantity = (index) => {
    const updatedItems = {...fetchitem};
    if (updatedItems.items[index].item_quantity > 1) {
      updatedItems.items[index].item_quantity -= 1;
      setfetchitem(updatedItems);
      updateCartInDB(updatedItems.items);
    } 
    else if (updatedItems.items[index].item_quantity === 1) {
      updatedItems.items.splice(index, 1);
      setfetchitem(updatedItems);
      updateCartInDB(updatedItems.items);
    }
  };

  const handleProceedToPayment = async () => {
    const orderData = {
      userid: fetchitem.user,  // Use actual user ID
      storeid: fetchitem.items[0].store,  // Use actual store ID
      orders: fetchitem.items,  // Cart items
      address: address,
      total_amount: finalTotal.toFixed(2),
      currentStep: Math.floor(Math.random() * 4) + 1,
    };

    try {
      // Make the API call to add the new order
      const response = await axios.post(`${apiBaseUrl}/api/orders/add`, orderData);
      if (response.status === 201) {
        alert('Order placed successfully');
        axios.delete(`${apiBaseUrl}/api/cart/delete/${fetchitem.id}`);
        
        setfetchitem(null);
        // Clear cart or redirect to confirmation page if needed
      }
    } catch (error) {
      console.error('Error placing the order:', error);
    }
  };
  
  return (
    <>
    {isloggedin ? (
    <Box
      sx={{
        py: 4,
        px: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        transition: 'margin-left 0.3s',
        marginLeft: isNavOpen ? '240px' : '0px',
        width: isNavOpen ? 'calc(100% - 240px)' : '100%',
      }}
    >
      {fetchitem?.items?.length?(
      <>
      {/* Left section: Cart Items + Bill */}
      <Box
        sx={{
          flex: 1,
          pr: { md: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography variant="h5" mb={2}>
          Cart Items <ShoppingCartOutlinedIcon />
        </Typography>
        <Paper elevation={2} sx={{ p: 2 }}>
          {/* Persistent Store Section */}
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar src={storeInfo.store_image} sx={{ mr: 2, width: 50, height: 50 }} />
            <Box>
              <Typography variant="h6">{storeInfo.store_name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Landmark: {storeInfo?.store_address?.area || 'No landmark available'}
              </Typography>
            </Box>
          </Box>

          {/* Scrollable Cart Items Section */}
          <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2, '&::-webkit-scrollbar': { display: 'none' }}}>
            {fetchitem.items.map((item, index) => (
              <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box display="flex" alignItems="center">
                  <Typography>{item.item_name}</Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <IconButton onClick={() => decreaseQuantity(index)} size="small">
                    <Remove />
                  </IconButton>
                  <Typography>{item.item_quantity}</Typography>
                  <IconButton onClick={() => increaseQuantity(index)} size="small">
                    <Add />
                  </IconButton>
                </Box>
                <Typography>₹{item.item_price} x {item.item_quantity} = ₹{(item.item_price * item.item_quantity).toFixed(2)}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Bill Details Inside Scrollable List */}
            <Box>
              <Typography variant="h6">Bill Details</Typography>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>Platform Fees</Typography>
                <Typography>₹{platformFees}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>GST (18%)</Typography>
                <Typography>₹{gstAmount.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>Delivery Charges</Typography>
                <Typography>₹{deliveryCharges}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>Tip for Delivery Boy</Typography>
                <Typography>₹{deliveryTip}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Persistent Total Section */}
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Total Amount</Typography>
            <Typography variant="h6">₹{finalTotal.toFixed(2)}</Typography>
          </Box>
        </Paper> 
      </Box>

      {/* Right section: User Info, Address, Payment */}
      <Box
        sx={{
          width: { xs: '100%', md: '30%' },
          mt: { xs: 4, md: 0 },
        }}
      >
        {/* User Information */}
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar sx={{ mr: 2 }}>{user.name.charAt(0)}</Avatar>
            <Typography>{user.name}</Typography>
          </Box>
          <Typography>Mobile: {user.mobile}</Typography>
        </Paper>

        {/* Address Section */}
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Delivery Address</Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            value={address}
            onChange={handleAddressChange}
            InputProps={{
              readOnly: !isEditingAddress, // Editable if in "edit mode"
            }}
            variant="outlined"
            sx={{ mt: 1 }}
          />
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleEditAddress}
          >
            {isEditingAddress ? 'Save Address' : 'Change Address'}
          </Button>
        </Paper>

        {/* Payment Button */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Button fullWidth variant="contained" color="primary" onClick={handleProceedToPayment}>
            Proceed to Payment
          </Button>
        </Paper>
      </Box>
      </>):(
        <Box
        sx={{
          flex: 1,
          pr: { md: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: 'flex', justifyContent: 'center' }} // Center horizontally
          >
            Your Cart is Empty
          </Typography>
        </Box>
      )}
    </Box> ) : (
      <p style={{color:'red', justifyContent:'center',display: 'flex',fontSize:'1.5rem'}}>You have to Signin First !!</p>
    )}
    </>
  );
}

export default CartPage;