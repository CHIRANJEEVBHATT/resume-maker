import mongoose from "mongoose";
import pkg from "jsonwebtoken";

const { verify } = pkg; 

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
 },{
    timestamps: true
 });


const userModel = mongoose.models.user || model("user", userSchema);

export default userModel;
