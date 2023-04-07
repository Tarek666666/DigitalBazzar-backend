import Product from '../models/ProductsModel.js' 


// functions to control the products routes

async function getAllProducts  (req, res){

    const importedProducts = await Product.find({})
    res.send(importedProducts)
}
async function getProductDetails  (req, res){

    const selectedProduct = await Product.findById(req.params.id)
    res.json(selectedProduct)
}





export {getAllProducts , getProductDetails };

