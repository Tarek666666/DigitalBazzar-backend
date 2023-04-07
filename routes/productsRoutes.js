import express from 'express'
import { getAllProducts , getProductDetails } from '../controllers/productsController.js';

const productsRouter = express.Router();

productsRouter.get('/allproducts', getAllProducts)

productsRouter.get('/productdetails/:id' ,  getProductDetails)

export default productsRouter;

