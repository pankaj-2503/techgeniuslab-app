const express = require('express')
require('dotenv').config();
const connectDB = require("./config/database");
const userRouter = require('./Router/userRouter');
const productRouter = require('./Router/courseRouter');
// const adminRouter = require('./routers/adminRouter');

const app = express()

const sendmail = require('./Controller/UserController_email');
const { send } = require('process');

app.use(express.urlencoded({extended: false }));

//server start test
app.get('/', function (req, res) {
  res.send('Server running');
})


//mongoDB connectiongit
// connectDB();

//middlewares
app.use(express.json());

//router
// app.use('/api/user',userRouter)
// app.use('/api/product',productRouter)
// app.use('/api/admin',adminRouter)
// app.use('/api/order',orderRouter);


app.listen(process.env.PORT || 5000)