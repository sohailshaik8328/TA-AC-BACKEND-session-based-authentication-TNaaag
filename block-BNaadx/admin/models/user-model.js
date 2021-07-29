var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName : {type : String},
    lastName : {type : String},
    email : {type : String, unique : true},
    password : {type : String},
    city : {type : String}
}, {timestamps : true});

userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if(err) return next(err);
            this.password = hashed;
            return next()
        })
    } else {
        next();
    }
})

userSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
        return cb(err, result)
    })
}

userSchema.methods.fullName = function() {
    return this.firstName + '  '+ this.lastName
}

module.exports = mongoose.model('User', userSchema);