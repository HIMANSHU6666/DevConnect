import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        minlength:[3,"Name must be at least 3 characters"],
        maxlength:[50,"Name cannot exceed 50 characters"],
    },
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true,
        minlength:[3,"Username must be at least 3 characters"],
        maxlength:[20,"maximum characters only be 20 "],
        lowercase:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:[true,"Password is Mandatory"],
        minlength:[8,"minimum 8 characters required"],
    },
    role:{
        type:String,
        enum:["buyer","seller"],
        default:"buyer",
    },
    avatar:{
        public_id:{
            type:String,
            default:"",
        },
        url:{
            type:String,
            default:"",
        }  ,
    },
    bio:{
        type:String,
        trim:true,
        maxlength:[200,"maximun 200 characters"],
        default:"",
    },

},
{timestamps:true},
);



userSchema.pre("save",async function () {
    if(!this.isModified("password")){
        return ;
    }
    const hashedPassword = await bcrypt.hash(this.password,10);
    this.password = hashedPassword;
});

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
    
};

userSchema.methods.generateToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};



const User = mongoose.model("User", userSchema);

export default User;