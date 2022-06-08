if(process.env.NODE_ENV !=="production"){
    require("dotenv").config({path:".env"})
}


const stripeSecretKey=process.env.STRIPE_SECRET_KEY
const stripePublicKey=process.env.STRIPE_PUBLIC_KEY
console.log(stripeSecretKey,stripePublicKey)

const { resolveSoa } = require("dns")
const express=require('express')
const app=express()
const fs=require('fs')

app.set("view engine","ejs");
app.use(express.json())
app.use(express.static("public"));
const stripe=require('stripe')(stripeSecretKey)

app.get("/store",(req,res)=>{
    fs.readFile("data.json",(e,data)=>{
        if(e){
            res.status(500).end();
        }else{
            res.render("store.ejs",{
                stripePublicKey:stripePublicKey,
                data:JSON.parse(data)
            })
        }
    })
})

app.post("/purchase",(req,res)=>{
    fs.readFile("data.json",(e,data)=>{
        if(e){
            res.status(500).end();
        }else{
           const itemJson=JSON.parse(data);
           const itemArray=itemJson.mens.concat(itemJson.women);
           let total=0
            req.body.items.forEach(function(item){
                const itemJson=itemArray.find(function(i){

                    return i.id==item.id;
                })
                total=total+itemJson.price*item.quantity
            })
         }
         stripe.charges.create({
            amount:total,
            source:req.body.stripeTokenId,
            currency:"usd",
         })
    });
});

const Port=process.env.PORT|| 5000

app.listen(Port, ()=>console.log('Server ishlayopti',Port))