let mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InfluenceSchema = Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  keyword: { type: String, required: true },
  completed: { type: Boolean, default: false },
  goal: { type: Number, required: true },
  current_status: { type: Number, default: 0 },
  payment_ref: { type: String },
  cost: { type: Number, required: true },
  influencers: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now() }
}, { id: true });

// Duplicate the ID field.
InfluenceSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
InfluenceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

const InfluenceModel = mongoose.model("Influence", InfluenceSchema);
module.exports = InfluenceModel
