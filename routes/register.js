var express = require('express');
var mongo = require("mongoose");
var encrypt = require('bcryptjs');
var user = require('../schemas/user_schema');
const { response } = require('express');
const { hash } = require('bcrypt');


var router = express.Router();
router.use(express.json());
router.use(express.urlencoded());


const db_url = "mongodb://localhost:27017/blogging"
mongo.connect(db_url);
mongo.connection.on("connected",()=>{
    console.log("CONNECTED");
});


router.get('/',(req,res)=>
{
    res.render('register',{});
})

router.post('/',async (req,res)=>{
    console.log(req.body);

    user.find({email: req.body.email},async (err,docs)=>{
        if(docs.length==0)
        {
            await createUser(req,res);
        }
        else
        {
            res.send({
                status:0,
                message:"User already exists"
            })
        }
    });
})

function createUser(req,res)
{
    var hashed_pass="";

    encrypt.genSalt(10,(err,salt)=>{
        encrypt.hash(req.body.password,salt,(err,hash)=>
        {
            hashed_pass = String(hash);
            var new_user = new user({
                email:req.body.email, 
                password: hashed_pass
            })
            return new_user.save().then(()=>{
                SendToken(req,res);            
            });
        })
    });     
}

function SendToken(req,res)
{   

    user.find({email: req.body.email},(err,docs)=>{
        if(!err && docs.length!=0)
        {
            res.send({
                bloggingTokenId: docs[0]._id,
                status:1
            })
        }
        else
        {   
            res.send({
                status:0,
                message:"Connection Issue"
            })
        }
    });
}

module.exports = router;