// server/src/models/EventBudget.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventBudgetSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  budget: { type: Number, required: true },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('EventBudget', eventBudgetSchema);
