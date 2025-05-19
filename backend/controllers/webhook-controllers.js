const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orders');
const HttpError = require('../models/http-error');

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        try {
            // Update order status in your database
            const order = await Order.findById(session.metadata.order_id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            order.paymentStatus = 'paid';
            order.paymentId = session.payment_intent;
            await order.save();

            // Here you can trigger order confirmation email, etc.

        } catch (err) {
            console.error('Error updating order:', err);
            return res.status(500).json({ message: 'Error updating order status' });
        }
    }

    res.json({ received: true });
};

module.exports = { handleStripeWebhook };