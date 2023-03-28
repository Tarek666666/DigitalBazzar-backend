import mongoose, { Schema } from "mongoose";
import Product from "./ProductsModel.js";

const OrderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This is the name of the product schema
        required:true,
        unique:false
       
    },
    order:{
        items: [{
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // This is the name of the product schema
            required: true
          },
          qty: {
            type: Number,
            required: true,
            default: 1
          }
        }],
        total:{type:Number , default:0}
      },
    createdAt:{
        type: Date,
        default: Date.now() 
    },
    shipped:{
        type:Boolean,
        default :false
    }
  });

const UserSchema = mongoose.Schema(

    {   

        username:{
            type: String,
            required: true
        },
        
        email:{
            type: String,
            required: true,
            unique:true
        },
        password:{
            type:String,
            required: true
        },
        adress:{
            type: String,
            required: true
        },
        phone:{
            type: String,
            required: true
        },
        cart: {
            items: [{
              productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // This is the name of the product schema
                required: true
              },
              qty: {
                type: Number,
                required: true,
                default: 1
              }
            }],
            total:{type:Number , default:0}
          },
          role:{
            type : String,
          },

        refreshToken:{
            type:String
        },
        verified:{
            type: Boolean,
            required:true,
            default:false
        }   
    }
)

const tokenSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // This is the name of the product schema
        required:true,
        unique:true
    },
    token:{
        type: String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now() , expires:3600
    }

  });

UserSchema.methods.addToCart = async function(item) {
    let cart = this.cart;
if(cart.items.length === 0){
    cart.items.push({productId: item._id.toString() , qty:1})
    cart.total = item.price 
    return this.save();

}else{
    
   const isAdded = await cart.items.filter(prod => prod.productId.toString() === item._id.toString() )
   if(isAdded.length > 0){

        cart.items.forEach(item => {
            if(item._id === isAdded[0]._id ){
                item.qty += 1;
            }
        });
    cart.total += item.price 
    return this.save()

   }else{
    cart.items.push({productId: item._id.toString() , qty:1})
    cart.total += item.price 
    return this.save()
   }
}
  };

  UserSchema.methods.increaseItem = async function(id , price) {
    let cart = this.cart;

    cart.items.forEach(element => {
        if(element.productId._id.toString() === id){
            element.qty +=1
            cart.total += price
        }
    });
    
    return this.save()
  };

  UserSchema.methods.decreaseItem = async function(id , price) {
    let cart = this.cart;
    console.log('wil deacresssssssssssssssssssssssse')
    cart.items.forEach((element , index) => {
        if(element.productId._id.toString() === id){
            if(element.qty === 1){
                cart.items.splice(index, 1);
                cart.total -= price
            }else{
                element.qty -=1
                cart.total -= price
            }
        }
    });
    return this.save()
  };
  UserSchema.methods.deleteFromCart= async function(id , price) {
    let cart = this.cart;
    console.log('deleteing elemet')
    cart.items.forEach((element , index) => {
        if(element.productId._id.toString() === id){
                
                cart.items.splice(index, 1);
                cart.total -= price * element.qty 
        }
    });
    return this.save()
  };

const  User = mongoose.model('User' , UserSchema); 
const  Order = mongoose.model('Order' , OrderSchema); 
const  Token = mongoose.model('Token' , tokenSchema); 
export default { User,Order , Token }; 



