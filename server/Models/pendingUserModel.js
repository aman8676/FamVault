import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        trim:true,
        maxlength:[50,'Name cannot be more than 50 characters']
    },
    email:
    {
        type:String,
        required:[true,'Please add an email'],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:[6,'Password must be at least 6 characters'],
        select:false
    },

    avatar:{
        type:String,
        required:[true,'Avatar is required'],
        default:null
    },

    verifyOtp:{
        type:String,
        default:''
    },

    verifyOtpExpiresAt:{
        type:Number,
        default:0
    }
},{timestamps:true});

const pendingUserModel = mongoose.models.PendingUser|| mongoose.model("PendingUser",pendingUserSchema);

export default pendingUserModel;
