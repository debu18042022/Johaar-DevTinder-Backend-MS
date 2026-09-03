const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not valid status'
        }
    }
}, { timestamps: true });

// Compound Index : Optimizes the duplication check inside the route
ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
ConnectionRequestSchema.index({ toUserId: 1, fromUserId: 1 });

// use .pre() when we want Mongoose to automatically perform something before an opeartion (actual save to DB i.e [await connectionRequest.save();])
// ConnectionRequestSchema.pre('save', function () {
//     next();
// })

module.exports = mongoose.model('ConnectionRequest', ConnectionRequestSchema);