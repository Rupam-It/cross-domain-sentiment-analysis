const express= require("express");
const app= express();

app.get("/",(req,res)=>{
    res.send("<h1>Hello World<h1/>");
});

app.listen(3000,(req,res)=>{
    console.log("app is listening on port 3000!")
})