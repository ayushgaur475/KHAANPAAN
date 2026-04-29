import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// placing user order from frontend
const placeOrder = async (req,res) => {

    const frontend_url = "http://localhost:5173";

    try {
        const user = await userModel.findById(req.body.userId);
        let discount = 0;
        if (req.body.useCoins && user.coins > 0) {
            discount = Math.min(user.coins, req.body.amount);
            // Deduct coins immediately (if payment fails, we might need a refund logic, but for simplicity we do it here)
            await userModel.findByIdAndUpdate(req.body.userId, { $inc: { coins: -discount } });
        }

        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount - discount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        // CHECK FOR TEST MODE (If Stripe key is not configured)
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("REPLACE_ME")) {
            console.warn("STRIPE_SECRET_KEY not configured. Using Test Mode (Auto-success).");
            return res.json({
                success: true, 
                session_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`
            });
        }
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))

        // Add discount as a negative line item if possible or just adjust total
        // Stripe checkout doesn't easily support negative items, so we adjust the total or add a coupon.
        // For simplicity, we just adjust the unit_amount of the first item or subtract from delivery
        
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100
            },
            quantity:1
        })

        // Handle Discount in Stripe
        if (discount > 0) {
            line_items.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Loyalty Discount",
                    },
                    unit_amount: -discount * 100
                },
                quantity: 1
            });
        }

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            payment_method_types: ['card', 'upi'],
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            const order = await orderModel.findByIdAndUpdate(orderId,{payment:true});
            
            // CREDIT COINS: 5% of order amount
            const coinsEarned = Math.floor(order.amount * 0.05);
            if (coinsEarned > 0) {
                await userModel.findByIdAndUpdate(order.userId, { $inc: { coins: coinsEarned } });
            }

            res.json({success:true,message:"Paid"})
        }
        else{
            // If user used coins but payment failed, we should refund them
            const order = await orderModel.findById(orderId);
            // This would require tracking how many coins were used in the orderModel
            // For now, simple delete
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


// user orders for frontend

const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId}).sort({date:-1});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Listing orders for admin panel
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({}).sort({date:-1});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// api for updating order status
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}
