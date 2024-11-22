const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username : {
        required :true,
        type:String,
        unique:true
    },
    password:{
        required:true,
        type:String
    },
    avtar:{
        type:String,
        default:'default-avtar.png'
    }
});

//pre save hashed
userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});


//compare
userSchema.methods.comparePassword =  async function(password) {
    return await bcrypt.compare(password, this.password); // Compare password
}

// Hide password before returning user object in JSON
userSchema.methods.toJSON = function() {
    const user = this.toObject();  // Convert the Mongoose document to a plain JavaScript object
    delete user.password;  // Remove the password field from the returned object
    return user;  // Return the user object without the password
};


const User = mongoose.model('User',userSchema);
module.exports = User;
