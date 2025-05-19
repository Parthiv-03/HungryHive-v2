import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { Stepper, Step, StepLabel, Dialog, DialogContent, IconButton } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import MapIcon from '@mui/icons-material/Map';
import CloseIcon from '@mui/icons-material/Close';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

function LiveOrdersPage() {
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const user = useSelector((state) => state.user.user);
  const isloggedin = useSelector((state) => state.user.isLoggedin);

  // Fetch items from the database
  const [orderitem, setorderitem] = useState([]);
  const [storeArray, setStoreArray] = useState([{ store_name: '' }]);
  useEffect(() => {
    const fetchOrder = async () => {
      if (!isloggedin) {
        return;
      }
      try {
        const response = await axios.get(`${apiBaseUrl}/api/orders/${user._id}`);
        setorderitem(response.data.orders);

        const stores = await Promise.all(
          response.data.orders.map(async (order) => {
            const storeresponse = await axios.get(`${apiBaseUrl}/api/store/${order.store}`);
            return storeresponse.data.store;
          })
        );

        setStoreArray(stores);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, []);

  useEffect(() => {
    console.log(orderitem); // Log fetched cart details for debugging
    console.log(storeArray);
  }, [orderitem, storeArray]);

  // Toggle order details view
  const handleToggleDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Open and close the map modal
  const handleMapOpen = () => {
    setMapOpen(true);
  };

  const handleMapClose = () => {
    setMapOpen(false);
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/orders/delete/${orderId}`);
      setorderitem(orderitem.filter(order => order._id !== orderId));
      alert('Order has been cancelled.');
    } catch (err) {
      console.error(err);
      alert('Failed to cancel the order.');
    }
  };

  return (
    <>
      {isloggedin ? (
        <Box
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Your Current Orders
          </Typography>

          {/* Order List */}
          {orderitem.map((order, index) => (
            <Card
              key={index}
              sx={{ width: '90%', maxWidth: 800, borderRadius: 4, boxShadow: 3, mb: 3 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {storeArray[index]?.store_name || 'storename'}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Ordered at: {order.orderedAt}
                </Typography>

                {/* Order Item List */}
                <List>
                  {order.orders.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${item.item_name} (x${item.item_quantity})`}
                        secondary={`₹${item.item_price}`}
                      />
                    </ListItem>
                  ))}
                  <ListItem>
                    <ListItemText primary="Total" secondary={`₹${order.total_amount}`} />
                  </ListItem>
                </List>

                {/* View Details / Close Details Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleToggleDetails(order._id)}
                    sx={{ mt: 2 }}
                  >
                    {expandedOrder === order._id ? 'Close Details' : 'View Details'}
                  </Button>

                  {/* Cancel Order Button */}
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelOrder(order._id)}
                    sx={{ mt: 2 }}
                  >
                    Cancel Order
                  </Button>
                </Box>

                {/* Collapsible Order Details */}
                <Collapse in={expandedOrder === order._id} timeout="auto" unmountOnExit>
                  {/* Progress Bar */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Card sx={{ flex: 1, borderRadius: 4, boxShadow: 3, mr: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Order Progress
                        </Typography>
                        {/* Vertical Stepper Progress Bar */}
                        <Box
                          sx={{
                            height: '250px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Stepper orientation="vertical" activeStep={order.currentStep}>
                            {order.progress.map((label, index) => (
                              <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                              </Step>
                            ))}
                          </Stepper>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Delivery Man Info */}
                    <Card sx={{ flex: 1, borderRadius: 4, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Delivery Person Info
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            src="https://via.placeholder.com/100"
                            sx={{ width: 80, height: 80, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="subtitle1">Rahul Sharma</Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                              9965317864
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Estimated delivery time: 15-20 minutes
                        </Typography>

                        {/* Call and View in Map Buttons */}
                        <Button
                          variant="outlined"
                          startIcon={<PhoneIcon />}
                          sx={{ width: '80%', mb: 1, fontSize: '0.8rem', padding: '6px 12px' }}
                          onClick={() => alert('Calling the delivery person...')}
                        >
                          Call Delivery Person
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<MapIcon />}
                          sx={{ width: '80%', fontSize: '0.8rem', padding: '6px 12px' }}
                          onClick={handleMapOpen}
                        >
                          View in Map
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}

          {/* Map Dialog */}
          <Dialog
            open={mapOpen}
            onClose={handleMapClose}
            maxWidth="xs"
            fullWidth={false}
            PaperProps={{
              style: {
                width: '500px',
                height: '500px',
              },
            }}
          >
            <DialogContent>
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleMapClose}
                aria-label="close"
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={[51.505, -0.09]}>
                  <Popup>Store Location</Popup>
                </Marker>
                <Marker position={[51.515, -0.1]}>
                  <Popup>Delivery Location</Popup>
                </Marker>
              </MapContainer>
            </DialogContent>
          </Dialog>
        </Box>
      ) : (
        <p
          style={{
            color: 'red',
            justifyContent: 'center',
            display: 'flex',
            fontSize: '1.5rem',
          }}
        >
          You have to Sign in first!
        </p>
      )}
    </>
  );
}

export default LiveOrdersPage;
