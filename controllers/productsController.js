import Product from '../models/ProductsModel.js' 


//get All products from db
async function getAllProducts  (req, res){

    const importedProducts = await Product.find({})
    res.send(importedProducts)
}

//get a single product from Db
async function getProductDetails  (req, res){

    const selectedProduct = await Product.findById(req.params.id)
    res.json(selectedProduct)
}

export {getAllProducts , getProductDetails };

