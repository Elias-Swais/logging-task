const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000
const {errorHandler} = require('./middleware/errorMiddleware');
const { error } = require('console');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db')
const logger = require('./middleware/logger');
const app = express();

connectDB()


app.use(logger);
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/api/users',require('./routes/userRoutes'))
app.use(errorHandler)
app.listen(port, ()=> console.log(`Server started on port ${port}`))