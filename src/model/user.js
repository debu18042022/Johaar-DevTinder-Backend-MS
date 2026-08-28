const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 4,
        maxLenght: 50,
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 4,
        maxLenght: 50,
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        maxLenght: 50,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        // enum: ['male', 'female', 'others'],

        // validate: function (gender) {
        //     if (!gender.includes(['male', 'felmale', 'others'])) {
        //         throw new Error("Gender is not valid");
        //     }
        // },

        validate: {
            validator: function (gender) {
                return ['male', 'female', 'others'].includes(gender);
            },
            message: 'gender can only be male, female, others'
        }
    },
    photoUrl: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/user-profile-icon-black-silhouette-avatar-placeholder-simple-graphic-generic-user-profile-icon-black-silhouette-style-433286589.jpg"
    },
    about: {
        type: String,
        default: "This is a about of the user"
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema);