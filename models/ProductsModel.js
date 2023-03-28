import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
    {   
        name:{
            type: String,
            require: true
        },
        description:{
            type:String,
            
        },
        image:{
            type:String,
            require:true
        },
        price:{
            type:Number,
            require:true

        },
        category:{
            type:String,
            require:true
        },
        rating:{
            type:Number,
            default: 0
        },
        brand:{
            type:String,
            require:true
        },
        featured:{
            type:Boolean
        }
        ,
        createdBy:{
            type:String
        }
    }

)

const Product = mongoose.model('Product' , ProductSchema);
export default  Product 