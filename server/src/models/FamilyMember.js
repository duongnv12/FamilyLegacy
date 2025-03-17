// server/src/models/FamilyMember.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marriedInfoSchema = new Schema({
  date: Date,
  spouse: {
    name: { type: String },
    birthDate: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] }
  },
  location: { type: String },
  notes: { type: String }
}, { _id: false });

const deceasedInfoSchema = new Schema({
  date: Date,
  location: { type: String },
  reason: { type: String },
  notes: { type: String }
}, { _id: false });

const familyMemberSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'],
  },
  placeOfBirth: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Sống', 'Mất'],
    default: 'Sống',
  },
  role: {
    type: String,
    required: true,
    // Founder được gán làm gốc, các thành viên khác mặc định là "Member"
    default: 'Member',
  },
  additionalInfo: {
    type: String,
    default: '',
  },
  // Trường dùng để nối kết các node: nếu là con của ai thì sẽ lưu parentId
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'FamilyMember',
    default: null,
  },
  // Thông tin hôn nhân (nếu có)
  marriedInfo: {
    type: marriedInfoSchema,
    default: null,
  },
  // Thông tin về khi mất đi (nếu có)
  deceasedInfo: {
    type: deceasedInfoSchema,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('FamilyMember', familyMemberSchema);
