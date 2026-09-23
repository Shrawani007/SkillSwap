import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  requestedSkill: { 
    type: String, 
    required: true 
  },
  offeredSkill: { 
    type: String, 
    required: true
  },
  proposalNote: {
      type: String,
      required: true
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Connected', 'Rejected'], 
    default: 'Pending' 
  },
}, 
{ timestamps: true });

RequestSchema.index({ sender: 1, receiver: 1, requestedSkill: 1, offeredSkill: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'Pending' } });
export default mongoose.model('Request', RequestSchema);