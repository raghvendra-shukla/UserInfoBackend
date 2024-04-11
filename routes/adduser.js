const express=require("express");
const router = express.Router();
const Adduser=require("../models/Adduser");
const { body, validationResult } = require('express-validator');
const { request } = require("express");
const middleware = require("../middelware/middleware");

// Route1: fetchingAuser using get request
router.get('/fetchaInfo',middleware, async(req, res) => {
  try {
    const info=await Adduser.find({user:req.user.id});
    res.json(info);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});
// Route2: fetchingAlluser using get request
router.get('/fetchInfo',middleware, async(req, res) => {
  try {
    const info=await Adduser.find();
    res.json(info);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
    // res.send(null);
  }
});

// Route2: adding new user using post 
router.post("/addInfo",[
  body("name"),
  body("email"),
  body("gender"),
  body("city"),
  body("phone")
],middleware,async(req,res)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    const {name,email,gender,city,phone}=req.body;
    const info=new Adduser({
      name,email,gender,city,phone,user:req.user.id
    });
    const saveData=await info.save();
    res.json(saveData);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

// route3 to update the profile
router.put("/updateInfo/:id",middleware,async (req,res)=>{
    const {name,email,gender,city,phone}=req.body;
    // creating a profile object
    const newprofile={};
    if(name){newprofile.name=name};
    if(email){newprofile.email=email};
    if(gender){newprofile.gender=gender};
    if(city){newprofile.city=city};
    if(phone){newprofile.phone=phone};
    //find the profile to be update and update it
    let info=await Adduser.findById(req.params.id);
    if(!info){return res.status(404).send("Not Found")};
    if(info.user.toString()!==req.user.id){
      return res.send("Not Allowed");
    }
    info=await Adduser.findByIdAndUpdate(req.params.id,{$set:newprofile},{new:true});
    res.json({info});
  });

  // Route:4 delete the using delete request
  router.delete("/deleteInfo/:id",middleware,async (req,res)=>{
    //find the profile to be delete and delete it
    try{
      let info=await Adduser.findById(req.params.id);
      if(!info){return res.status(404).send("Not Found")};
      if(info.user.toString()!==req.user.id){
        return res.send("Not Allowed");
      }
      info=await Adduser.findByIdAndDelete(req.params.id);
      res.json("Success:The Info has been deleted");
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  });


module.exports=router