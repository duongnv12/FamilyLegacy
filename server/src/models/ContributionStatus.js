// server/src/models/ContributionStatus.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contributionStatusSchema = new Schema({
  memberId: { type: Schema.Types.ObjectId, ref: 'FamilyMember', required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ContributionStatus', contributionStatusSchema);
