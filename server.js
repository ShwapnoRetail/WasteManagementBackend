require('dotenv').config()
const cors = require('cors')
const express = require('express');
const mongoose = require('mongoose')
// routes
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/products');
const productOfferRoutes = require('./routes/productsOffer');


//express app
const app = express()


// middleware
app.use(express.json({ limit: '10mb' }))
app.use(cors());

app.use((req,res,next)=>{
    console.log(req.path,req.method);
    next()
})

// ROUTES
app.use('/api/user',userRoutes)

app.use('/api/products',productRoutes)

app.use('/api/productOffer',productOfferRoutes)




// connect to db
mongoose.connect(process.env.MONG_URI)
    .then(()=>{
        //listen for requests
        app.listen(process.env.PORT, ()=> {
            console.log('connected to db and listening on port 4000!');
        })
    })
    .catch((error)=>{
        console.log(error);
    })

