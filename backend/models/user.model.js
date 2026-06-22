import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date, default: new Date().getTime()
    }
});

const User = mongoose.model('User', userSchema);

export default User