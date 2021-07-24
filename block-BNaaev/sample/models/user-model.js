let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name :{type : String},
    email : {type : String, require : true, unique : true},
    password : {type : String, required : true, minlength : 5},
    age : {type : Number, default : 0},
    phone : {type : Number, minlength : 10}
}, {timestamps : true});

userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if(err) return next(err);
            this.password = hashed;
            return next();
        })
    } else {
        next();
    }
})

module.exports = mongoose.model("User", userSchema);