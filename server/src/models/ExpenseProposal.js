// server/src/models/ExpenseProposal.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseProposalSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  proposer: { type: Schema.Types.ObjectId, ref: 'FamilyMember', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('ExpenseProposal', expenseProposalSchema);
