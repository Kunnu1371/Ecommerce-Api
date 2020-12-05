const Order =  require('../models/order')
const Cart =  require('../models/cart')
const User = require('../models/user')
const {errorHandler} = require('../helpers/dbErrorHandler')
const  { decreaseQuantity } = require('../controllers/product')
const Nexmo = require('nexmo');
require('dotenv').config()
const sgMail = require('@sendgrid/mail');
const api_key = process.env.API_KEY
sgMail.setApiKey(api_key);


exports.orderById = (req, res, next, id) => {
    Order.findById(id)
    .exec((err, order) => {
        if(err || !order) {
            return res.status(404).json({
                error: "Order Not found"
            })
        }
        // console.log(order)
        req.order = order
        next()
    })
}

const {v1} = require('uuid');
let uuidv1 = v1;

exports.create = async (req, res) => {
    const order = {
        uniqueID: uuidv1(),
        user: req.profile,
        products: [],
        address: req.body.address,
    } 
    order.user.salt = undefined
    order.user.hashed_Password = undefined

    let history = []

    // Before placing order it will check cart is empty or not. If cart is empty a message will return "Cannot place order, cart is empty. "
    const user = req.params.userId
    const userCart = await Cart.findOne({user: user})
                               .populate('user', '_id role name phone email')
                               .populate('products.product')
    const productsInCart = userCart.products.length
    // console.log(productsInCart)

    if(productsInCart) {
        userCart.products.map((product) => {
            order.products.push(product)
        })
        const orderCreated = new Order(order) 
        let ordersbyUser = order.user.history.length
        await orderCreated.save(async (err, order) => {
            if(err) { return res.status(500).json({error: errorHandler(err)})}
            // console.log(order) 
            res.status(201).json({
                status: "success",
                message: "Order has been created successfully",
                order
            })      
                        
            // It push the order(s) in User's purchasing history
            User.findOneAndUpdate({_id: req.profile.id}, {$push: {history: order._id}}, {new: true}, (err, data) => { 
                if(err) {res.status(500).json(err)}
                // return res.status(201).json(data)
            })

            function getProductList() {
                let productList = "";
                userCart.products.map((product) => {
                    // console.log(product.product.name, product.product.price)
                    productList =
                    productList +
                    `
                    <tr>
                    <td>${product.product.name}</td>
                    <td>${product.product.price}</td>
                    <td>${product.quantity}</td>
                    <td>${product.product.description}<td>
                    </tr>
                    `;
                })
                return productList; 
        }
                            
        // Email Alert to Admin
        const emailData = {
            to: 'kunal.1822it1077@kiet.edu', // admin
            from: 'kunalgautam1371@gmail.com',
            subject: `A new order is received`,
            html: `
            <h1>Hey Admin, Somebody just made a purchase in your ecommerce store</h1>
            <h2>Customer details:</h2>
            <p><b>Customer name:</b> ${order.user.name}</p>
            <p><b>Email:</b> ${order.user.email}</p>
            <p><b>Address:</b> ${order.address}</p>
            <p><b>Purchase history:</b> ${order.user.history.length}</p>
            <p><b>Total products:</b> ${order.products.length}</p>
            <p><b>Transaction ID:</b> ${order.transaction_id}</p>
            <p><b>Order status:</b> ${order.status}</p>
            <h2>Product details:</h2>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Description</th>
                </tr>
            ${getProductList()}
            </table>
            <hr />`
        }
        await sgMail
        .send(emailData)
        .then(sent => console.log('SENT >>>', sent))
        .catch(err => console.log('ERR >>>', err));

        
        // Email Alert to Buyer
        const emailData2 = {
            // to: order.user.email,
            // from: 'noreply@ecommerce.com',
            to: 'kunalgautam13711@gmail.com',
            from: 'kunalgautam1371@gmail.com',
            subject: `You order has been successfully placed `,
            html: `
            <h1>Hey ${req.profile.name}, Thank you for shopping with us.</h1>
            <p>Total products: <b>${order.products.length}</b></p>
            <p>Transaction ID: <b>${order.transaction_id}</b></p>
            <p>Order ID: <b>${order.uniqueID}</b></p>
            <p>Order status: <b>${order.status}</b></p>
            <h2>Product details:</h2>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Description</th>
                </tr>
                ${getProductList()}
            </table>
            <hr />
            `
        }
        await sgMail
        .send(emailData2)
        .then(sent => console.log('SENT 2 >>>', sent))
        .catch(err => console.log('ERR 2 >>>', err));
    })    
        
    // It will clear the user's cart after order is placed
    Cart.findOneAndUpdate({user: user}, {$set: {products: []}}, {new: true}).exec((err, cart) => {
        if(err) return res.status(500).json(err)
        console.log("cart is cleared.")
    })
                    // // SMS Alert
                    //     const nexmo = await new Nexmo({
                    //         apiKey: process.env.APIKEY,
                    //         apiSecret: process.env.APISECRET,
                    //     });
                    //     const from = 'Vonage APIs';
                    //     // const to = order.user.phone;
                    //     const to = '919650543482';
                    //     // const text = `Order Placed: Your Order for products(s): ${name.map((name) => {
                    //     //     return name
                    //     // })} has been successfully placed. Order no. ${order._id}`;
                    //     const text = 'Hello World!'
                    //     nexmo.message.sendSms(from, to, text);

                    // order.user.history = undefined
                    // return res.status(201).json({
                    //     status: "success",
                    //     message: "Order created successfully",
                    //     order
                    // })
    }
    else { return res.status(400).json({message: "Cannot place order, cart is empty. "}) }
}


exports.OrderHistory = (req, res) => {
    Order.find({user: req.params.userId})
    .sort('-created')
    .exec((err, order) => {
        if(err) {
            return res.status(500).json({
                error: "Couldn't find order"
            })
        }
        return res.status(200).json({
            status: "success",
            Orders: order.length, 
            order
        })
    }) 
}


exports.getOrderDetail = (req, res) => {
    // console.log(req.order, req.order._id)
    Order.findById(req.order._id)
         .populate('user', 'name email role createdAt updatedAt')
         .exec((err, data) => {
             if(err) return res.status(500).json(err)
             return res.status(200).json({
                status: "success",
                data
            })
        })
}


exports.updateOrderStatus = async (req, res) => {
    await Order.findOneAndUpdate({_id: req.order._id}, 
                { $set: {status: req.body.status}},
                (err, order) => {
                    if(err) {
                        return res.status(500).json({
                            error: errorHandler(err)
                        })
                    }
                    res.status(200).json({
                        status: "success",
                        message: "Status changed successfully", 
                        order
                    })
                })
}


exports.TotalOrders = async (req, res) => {
    const ordersTillNow = await Order.countDocuments()
    var start = new Date();
    start.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23,59,59,999);
    const ordersToday = await Order.find( {createdAt: { "$gte": start, "$lt": end }}).countDocuments()
    const Pending = await Order.find({status: "Pending"}).countDocuments()
    const Confirmed = await Order.find({status: "Confirmed"}).countDocuments()
    const Placed = await Order.find({status: "Placed"}).countDocuments()
    const NotProcessed = await Order.find({status: "Not Processed"}).countDocuments()
    const Processing = await Order.find({status: "Processing"}).countDocuments()
    const Shipped = await Order.find({status: "Shipped"}).countDocuments()
    const Delivered = await Order.find({status: "Delivered"}).countDocuments()
    const Cancelled = await Order.find({status: "Cancelled"}).countDocuments()

    const orders = {
        TotalOrders: ordersTillNow, 
        TotalOrderToday: ordersToday,
        Pending: Pending,
        Confirmed: Confirmed,
        Placed: Placed,
        NotProcessed: NotProcessed,
        Processing: Processing,
        Shipped: Shipped,
        Delivered: Delivered,
        Cancelled: Cancelled
    }
    res.status(200).json({
        status: "success",
        orders
    })
}