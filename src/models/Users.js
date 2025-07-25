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
      emailVerificationToken: { type: String },
      isEmailVerified: { type: Boolean, default: false },
    }
  ],
  data: {
    seeds: {
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      data: [
        {
          //cat
          _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
          img: {
            url: { type: String },
            id: { type: String },
          },
          name: { type: String },
          Type: [
            {
              //subcat
              _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
              img: {
                url: { type: String },
                id: { type: String },
              },
              name: { type: String },
              description: {
                //desc
                img: {
                  url: { type: String },
                  id: { type: String },
                },
                name: { type: String },
                company: { type: String },
                description: { type: String }
              }
            }
          ]
        }
      ]
    },
    Fertilizer: {
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      data: [
        {
          //cat
          _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
          name: { type: String },
          img: {
            url: { type: String },
            id: { type: String },
          },
          Type: [
            {
              _id: {
                type: mongoose.Schema.Types.ObjectId,
                default: () => new mongoose.Types.ObjectId()
              },
              name: { type: String },
              img: {
                url: { type: String },
                id: { type: String }
              },
              company: { type: String, required: false }, // optional
              description: { type: String, required: false }, // optional
              Type: [
                {
                  _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: () => new mongoose.Types.ObjectId()
                  },
                  name: { type: String },
                  img: {
                    url: { type: String },
                    id: { type: String }
                  },
                  company: { type: String },
                  description: { type: String }
                }
              ]
            }
          ]

        }
      ]
    },
    Insecticide: {
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      data: [
        {
          //cat
          _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
          img: {
            url: { type: String },
            id: { type: String },
          },
          name: { type: String },
          Type: [
            {
              //subcat
              _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
              name: { type: String },
              img: {
                url: { type: String },
                id: { type: String },
              },
              description: { type: String },
              company: { type: String },
            }
          ]
        }
      ]
    },
    Communication: {
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
      data: [
        {
          //place
          _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
          img: {
            url: { type: String },
            id: { type: String },
          },
          name: { type: String },
          eng: [
            {
              //eng data
              _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
              img: {
                url: { type: String },
                id: { type: String },
              },
              name: { type: String },
              phone: { type: String },
            }
          ]
        }
      ]
    },
    main: {
      seeds: {
        img: {
          url: { type: String },
          id: { type: String },
        }
      },
      Fertilizer: {
        img: {
          url: { type: String },
          id: { type: String },
        }
      },
      Insecticide: {
        img: {
          url: { type: String },
          id: { type: String },
        }
      },
      Communication: {
        img: {
          url: { type: String },
          id: { type: String },
        }
      }
    }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
