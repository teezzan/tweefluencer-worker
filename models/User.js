var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AddressSchema = Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  postalcode: { type: String, required: true },
  number: { type: Number, required: true },
  numberAddition: { type: String, default: "" },
  status: { type: String, default: null },
  name: { type: String, default: null },
  email: { type: String, default: null },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
}, { id: true });

// Duplicate the ID field.
AddressSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
AddressSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

const AddressModel = mongoose.model("Address", AddressSchema);
module.exports = AddressModel
