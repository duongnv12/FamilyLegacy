// server/src/models/FinancialContribution.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const financialContributionSchema = new Schema({
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('FinancialContribution', financialContributionSchema);
