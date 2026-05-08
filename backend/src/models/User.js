import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['editor', 'filler'],
        default: 'filler'
    }
}, { timestamps: true });

// signup function
UserSchema.statics.signup = async function(username, email, password, role = 'filler') {

    if (!username || !email || !password) {
        throw Error("All fields must be filled!");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid!");
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Your password isn't strong enough!");
    }
    if (!['editor', 'filler'].includes(role)) {
        throw Error("Invalid role.");
    }

    const alreadyInUse = await User.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    });

    if (alreadyInUse) {
        const usernameAlreadyInUse = alreadyInUse.username === username;
        const emailAlreadyInUse = alreadyInUse.email === email;

        if (usernameAlreadyInUse && emailAlreadyInUse) {
            throw Error('Username and email already in use.');
        } else if (usernameAlreadyInUse) {
            throw Error('Username already in use.');
        } else {
            throw Error('Email already in use.');
        }
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ username, email, password: hash, role });

    return user;
}

// login function
UserSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled!");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        throw Error('User not found with this email.');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Password incorrect.');
    }

    return user;
}

const User = mongoose.model("User", UserSchema);

export default User;