var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name : {type : String},
    email : {type : String, unique : true},
    password : {type : String, minlength : 5}
}, {timestamps : true});

userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if(err) return next(err);
            console.log(hashed);
            this.password = hashed;
            return next();
        })
    } else {
        next();
    }
})

userSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
        console.log(this.password, password);
        return cb(err, result);
    })
}

module.exports = mongoose.model('User', userSchema);