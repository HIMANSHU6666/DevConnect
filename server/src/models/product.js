import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:[true,"Product name is required"],
        trim:true,
        minlength:[2,"Must be at least 2 characters"],
        maxlength:[50,"Maximum 50 characters"],
    },
    productCode:{
        type:String,
        required:true,
        minlength:[2,"Minimum 2 characters"],
        maxlength:[20,"Maximum 20 characters"],
        unique:true,
        trim:true,
    },
    productPrice:{
        type:Number,
        required:true,
        min:[0,"Price cannot be negative"],

    },
    productImage:{
        Image_id:{
            type:String,
            default:"",
        },
        Image_url:{
            type:String,
            required:true,
        },
    },
    productDescription:{
        type:String,
        required:true,
        trim:true,
        minlength:[2,"Minimum 2 characters"],
        maxlength:[200,"Maximum 200 characters"],
    },
    productDisscount:{
        type:Number,
        default:0,
        min:0,
        max:100,

    },
    productCategory:{
        type:String,
        trim:true,
        required:true,

    },
    productStock:{
        type:Number,
        required:true,
        min:[0,"Stock cannot be negative"]
    },
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        
    }

},
{timestamps:true},
);

const Product = mongoose.model("Product",productSchema);

export default Product;