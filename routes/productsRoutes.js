import express from 'express'
import Product from '../models/ProductsModel.js'  

const productsRouter = express.Router();

productsRouter.get('/allproducts', async (req, res , next)=>{

    const importedProducts = await Product.find({})
    res.send(importedProducts)
})

productsRouter.get('/productdetails/:id' ,  async (req, res)=>{
   
    const selectedProduct = await Product.findById(req.params.id)
    res.json(selectedProduct)
})

export default productsRouter;

