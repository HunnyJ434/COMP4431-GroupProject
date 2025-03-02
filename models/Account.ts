// models/Account.ts
import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mask: { type: String, required: true },
  type: { type: String, required: true },
  subtype: { type: String, required: true },
  balance: { type: Number, required: true },
  institution: {
    name: { type: String, required: true },
    institution_id: { type: String, required: true },
  },
});

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
