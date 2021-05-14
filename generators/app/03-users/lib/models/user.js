'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    password: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.toToken = function() {
    return {
        sub: this._id,
        fullName: this.fullName,
        email: this.email,
        role: this.role
    };
};

userSchema.pre('save', function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
    }
    return next();
});

module.exports = mongoose.model('User', userSchema);
