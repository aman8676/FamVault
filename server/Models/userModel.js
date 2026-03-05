import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
        default:null
    },

    verifyOtp:{
        type:String,
        default:''
    },

    verifyOtpExpiresAt:{
        type:Number,
        default:0
    },

    isAccountVerified:{
        type: Boolean,
        default: false
    },
    // Password Reset fields 
    resetOtp:{
        type:String,
        default:''
    },
    resetOtpExpiresAt:{
        type:Number,
        default:0
    }
},{timestamps:true})


const userModel = mongoose.models.User|| mongoose.model("User",userSchema);

export default userModel;