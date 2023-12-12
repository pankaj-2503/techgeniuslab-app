const express = require('express')
require('dotenv').config();
const connectDB = require("./config/database");
const userRouter = require('./Router/userRouter');
const productRouter = require('./Router/productRouter');
const adminRouter = require('./Router/adminRouter');
const orderRouter = require('./Router/orderRouter');
const app = express()

app.use(express.urlencoded({extended: false }));

//server start test
app.get('/', function (req, res) {
  res.send('Server running');
})
//mongoDB connectiongit
connectDB();

//middlewares
app.use(express.json());

//router
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/admin',adminRouter)
app.use('/api/order',orderRouter);


app.listen(process.env.PORT || 5000)