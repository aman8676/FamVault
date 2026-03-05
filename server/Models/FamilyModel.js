import mongoose from 'mongoose';

const familySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a family name"],
    trim: true,
    minlength: [3, "Family name must be at least 3"],
    maxlength: [50, "Family name cannot exceed 50 characters"],
  },

  description: {
    type: String,
    trim: true,
    maxlength: [150, "Description cannot exceed 150 characters"],
    default: "",
  },

  avatar: {
    type: String,
    default: null,
  },

  pin: {
    type: String,
    required: [true, "Please add a family pin"],
    select: false, // Don't return pin in queries
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Family must have an admin"],
  },

  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      role: {
        type: String,
        enum: ["admin", "member"],
        default: "member",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],

  // INVITATION sent via email

  invitations: [
    {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },

      tempPin:{
        type:String,
        select:false,
      }
    },
  ],

  settings: {
    maxMembers: {
      type: Number,
      default: 10,
      min: 2,
      max: 50,
    },
  },

  stats: {
    totalDocuments: {
      type: Number,
      default: 0, // Initially no document
    },

    totalMembers: {
      type: Number,
      default: 1, // At least admin
    }
  }
},
{timestamps:true});

const familyModel = mongoose.models.Family||mongoose.model("Family",familySchema);

export default familyModel;