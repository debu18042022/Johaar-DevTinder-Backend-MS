const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 4,
        maxLength: 50,
        set(value) { return value.charAt(0).toUpperCase() + value.slice(1) },
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email id');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Password must contains : minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1')
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],

        // validate: function (gender) {
        //     if (!gender.includes(['male', 'felmale', 'others'])) {
        //         throw new Error("Gender is not valid");
        //     }
        // },

        // validate: {
        //     validator: function (gender) {
        //         return ['male', 'female', 'others'].includes(gender);
        //     },
        //     message: 'gender can only be male, female, others'
        // }
    },
    photoUrl: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/user-profile-icon-black-silhouette-avatar-placeholder-simple-graphic-generic-user-profile-icon-black-silhouette-style-433286589.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Url is not valid');
            }
        }
    },
    about: {
        type: String,
        default: "This is a about of the user"
    },
    skills: {
        type: [String]
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordTokenExpiry: {
        type: Date
    }
}, { timestamps: true })

userSchema.methods.getJWT = function () {
    const user = this;

    const token = jwt.sign({ _id: user._id }, 'DEV@Tinder$790', { expiresIn: '1h' })

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUSer) {
    const user = this;

    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUSer, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);