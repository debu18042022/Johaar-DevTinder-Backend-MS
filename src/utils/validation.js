const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (firstName.length == 0 || lastName.length == 0) {
        throw new Error('Please enter valid name');
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error('Please enter valid emailId');
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error('Please enter valid password');
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills'];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );
    
    return isEditAllowed;
}

module.exports = { validateSignUpData, validateEditProfileData };