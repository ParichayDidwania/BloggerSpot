var mongo = require("mongoose");

const schema = new mongo.Schema(
    {
        user_id: String,
        username: String,
        user_content: String,
        comments:[
            {
                name:String,
                content:String
            }
        ]
    }
);
const posts = mongo.model('Post', schema,'Posts');
module.exports = posts;
