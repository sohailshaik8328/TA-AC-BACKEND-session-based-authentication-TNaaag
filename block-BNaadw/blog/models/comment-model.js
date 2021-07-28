var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    text : {type : String},
    articleId : {type : String, required : true, ref : "Article"}
}, {timestamps : true});

module.exports = mongoose.model('Comment', commentSchema);