// server/src/models/Transaction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  type: { type: String, enum: ['income', 'expense', 'voluntary'], required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  // Dùng cho giao dịch thu (định mức hoặc ủng hộ ngoài định mức)
  contributor: { type: Schema.Types.ObjectId, ref: 'FamilyMember' },
  // Dùng cho giao dịch chi
  responsiblePerson: { type: Schema.Types.ObjectId, ref: 'FamilyMember' },
  // Liên kết giao dịch với sự kiện nếu có
  eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
