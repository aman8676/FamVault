import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a document title"],
    trim: true,
    maxlength: [100, "Title cannot exceed more than 100 characters"],
  },

  description: {
    type: String,
    trim: true,
    maxlength: [200, "Description cannot exceed more than 200 characters"],
    default: "",
  },

  // File information

  fileUrl: {
    type: String,
    required: [true, "File url is required"],
  },

  fileName: {
    type: String,
    required: [true, "File name is required"],
  },

  fileType: {
    type: String,
    required: [true, "File type is required"],
  },

  fileSize: {
    type: Number,
    required: true,
  },

  //-------cloudinary storage ------
  cloudinaryPublicId: {
    type: String,
    required: [true, "Cloudinary Id is required"],
  },

  //-------AES-256 Encryption ------
  encryptionIV: {
    type: String,
    required: [true, "Encryption IV is required for decryption"],
    select: false, // Don't expose IV in normal queries
  },

  isEncrypted: {
    type: Boolean,
    default: true,
  },

  // -------ownership----------
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Uploader is required"],
  },

  // -- vault types --

  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required:false,
    default: null,
  },

  isPersonalVault:{
    type: Boolean,
    default: false,
  },

  // sharing features 

  sharedWith:[
    {
      family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
      },
      sharedAt: {
        type: Date,
        default: Date.now,
      },
      sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    }
  ],

  // when shared from personal vault to family vault 

  visibility: {
    type: String,
    enum: ["private", "family","shared"],
    default: "family",
  },

  category: {
    type: String,
    enum: [
      "identity",
      "financial",
      "medical",
      "legal",
      "education",
      "property",
      "other",
    ],
    default: "other",
  },

  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],

  deletedByUploader: {
    type: Boolean,
    default: false,
  },

  deletedFromFamily: {
    type: Boolean,
    default: false,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },

  //  TIMESTAMPS
  uploadedAt: {
    type: Date,
    default: Date.now,
  },

  deletedAt: {
    type: Date,
    default: null,
  }
},
{timestamps:true}
);


const docModel = mongoose.models.Doc|| mongoose.model("Doc",documentSchema);

export default docModel;