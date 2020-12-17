var encrypt = require('bcryptjs');
const { json } = require('express');
const express = require("express");
var mongo = require("mongoose");
var user = require('../schemas/user_schema');

const db_url = "mongodb://localhost:27017/blogging"

var router = express.Router();
router.use(express.urlencoded());
router.use(json());

mongo.connect(db_url);
mongo.connection.on("connected",()=>{
    console.log("CONNECTED");
});


router.get('/', function (req, res) {
    res.render('login', {})
})

router.post('/',async (req,res)=>{
    console.log(req.body);

    user.find({email: req.body.email},(err,docs)=>{
        if(!err && docs.length!=0)
        {
            encrypt.compare(req.body.password,docs[0].password,(err,match)=>{
                if(match)
                {
                    res.send(
                        {
                            bloggingTokenId: docs[0]._id,
                            status: 1
                        }
                    )
                }
                else
                {
                    res.send(
                        {
                            bloggingTokenId: docs[0]._id,
                            status: 0
                        }
                    )
                }
            })

            console.log(docs[0]._id);  
            
           
        }
        else
        {
            res.send(JSON.stringify({
                status: 0
            }))
            console.log("Incorrect Username");
        }
    })
    //res.send("OKAY")
})

module.exports = router;