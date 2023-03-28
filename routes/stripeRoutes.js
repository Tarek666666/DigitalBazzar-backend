import express from "express";
import Stripe from "stripe";
const stripeRouter = express.Router();

stripeRouter.post("/create-checkout-session", async (req, res, next) => {

        const stripe = Stripe(process.env.STRIPE_TEST_KEY);
        const session = await stripe.checkout.sessions.create({
            line_items: req.body.items.map((item) => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.productId.name,
                            images: [item.productId.image],
                            description: item.productId.description,
                        },
                        unit_amount: parseInt(item.productId.price.toFixed(2)) * 100,
                    },
                    quantity: item.qty,
                };
            }),

            mode: "payment",
            success_url: `${process.env.BASE_URL}/checkout-success`,
            cancel_url: `${process.env.BASE_URL}/cart`,
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "GB", "FR", "DE", "NL"],
            },
            billing_address_collection: "required",
        });

        res.json({ url: session.url });
  
});

export default stripeRouter;
