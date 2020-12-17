var mongo = require("mongoose");

const schema = new mongo.Schema({ email: String, password: String });
const user = mongo.model('User', schema,'Users');

module.exports = user;
