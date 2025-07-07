// models/Users.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  users: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      name: { type: String },
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      email: { type: String, unique: true, required: true },
      accessToken: { type: String },
      role: { type: String },
      resetOTP: String,
      resetOTPExpires: Date,
    }
  ],
  data: {
    seeds: {
      seedsType: [
        {
          img: { type: String },
          name: { type: String },
          seedType2: [
            {
              img: { type: String },
              name: { type: String },
              description: { type: String }
            }
          ]
        }
      ],
    },
    Fertilizer: {},
    Insecticide: {},
    Communication: {
      city: [
        {
          name: { type: String },
          eng: [
            {
              name: { type: String },
              phone: { type: String },
              img: { type: String },
            },
          ],
        },
      ],
    },
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
