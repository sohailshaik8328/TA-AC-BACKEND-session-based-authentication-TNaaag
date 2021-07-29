var mongoose = require('mongoose');
var slugger = require('slugger');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name : {type : String},
    quantity : {type : Number, default : 0},
    price : {type : Number},
    image : {type : String},
    likes : {type : Number, default : 0},
    comments : [{type : Schema.Types.ObjectId, ref : "Comment"}],
    slug : {type : String}
}, {timestamps : true});

productSchema.pre('save', function(next) {
    if(this.name) {
        var modified = slugger(this.name, {replacement : '-'});
        this.slug = modified;
        return next()
    } else {        console.log(modified);
        next();
    }
})

module.exports = mongoose.model('Product', productSchema);