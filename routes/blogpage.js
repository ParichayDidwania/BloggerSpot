var express = require('express');
var mongo = require("mongoose");
var encrypt = require('bcryptjs');
var user = require('../schemas/user_schema');
var posts = require('../schemas/post_schema');
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

router.get('/',(req,res)=>{
    res.render('blogpage',{});

})

router.post('/userinfo',(req,res)=>{
    user.find({_id: req.body.user_id},(err,docs)=>{
        if(!err)
        {
            res.send(
                {
                    'name': docs[0].email,
                    'status': 1
                }
            )
        }
        else{
            res.send(
                {
                    'status': 0
                }
            )
        }
    });
})

router.get('/postinfo',(req,res)=>{
    posts.find({},(err,docs)=>{
        if(!err)
        {
            docs.push({status:1});
            res.send(docs);
            console.log(docs);
        }
        else
        {
            res.send(
                {
                    status : 0
                }
            )
        }
    })
})

router.post('/postinfo',(req,res)=>{
    var data = new posts(req.body);
    data.save().then(()=>{
        
        res.send({
            status:1
        })
    })
    .catch((err)=>{
        res.send(
            {
                status : 0
            }
        )
    })
})

router.put('/postinfo',(req,res)=>{

    var comment = {

        name: req.body.name,
        content: req.body.content
    }

    posts.update(

        {_id : req.body.post_id},
        {$push: { comments : comment}}        
    ).then(()=>{

        res.send({
            status : 1
        })

    })
    .catch((err)=>{
        res.send(
            {
                status : 0
            }
        )
    })

});

router.delete('/postinfo',(req,res)=>{
    var data = new posts(req.body);
    posts.deleteOne({_id: req.body.post_id},(err)=>{
        if(!err)
        {
            res.send(
                {
                    status:1
                }
            )
        }
        else
        {
            res.send(
                {
                    status:0
                }
            )
        }
    })
})

router.get("*",(req,res)=>{
    res.send("URL NOT FOUND");
})


module.exports = router;