import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        dateAccountCreated: {type: Date},
        mediaAdded: [{
            addedAt: {type: Date},
            id: {type: Number},
            fullTitle: {type: String},
            nativeTitle: {type: String},
            format: {type: String},
            type: {type: String},
            status: {type: String},
            isAdult: {type: Boolean}

        }]

    }

)

const User = mongoose.model('User', userSchema)

export default User;