var mongoose = require('mongoose');
var slugger = require('slugger');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title : {type : String},
    description : {type : String},
    likes : {type : Number, default : 0},
    comments : [{type : Schema.Types.ObjectId, ref : "Comment"}],
    author : {type : String},
    slug : {type : String}
}, {timestamps : true});

articleSchema.pre('save', function(next) {
    if(this.title) {
        var modified = slugger(this.title, {replacement : '-'});
        this.slug = modified;
        return next()
    } else {        console.log(modified);
        next();
    }
})

module.exports = mongoose.model('Article', articleSchema);