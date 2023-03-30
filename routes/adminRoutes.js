import express from "express";
import Product from "../models/ProductsModel.js";
import isLoggedin from "../middleware/isLoggedin.js";
import userModels  from "../models/UsersModel.js";
const { Order , User } = userModels;
const adminRouter = express.Router();

adminRouter.get("/dashboard",  async (req, res, next) => {
    //case loggedin user and role is admin
    console.log(req.user , req.user.role , '------------------>>>>>>>>>>>>>')
    if (req.user && req.user.role === 'admin') {
        res.send({ isAuth: true, user: req.user });
    } else {
        //case unknown user
        res.send({ isAuth: false });
    }
});

adminRouter.post("/dashboard/addnewproduct", isLoggedin, async (req, res, next) => {
    try {
        const newProductToAdd = await Product.insertMany({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            price: req.body.price,
            category: req.body.category,
            category: req.body.category,
            rating: req.body.rating,
            brand: req.body.brand,
            featured: req.body.featured,
            createdBy: req.user.username,
        });
        res.json({ newProductToAdd, msg: "product added" });
    } catch (error) {
        res.json({ error });
    }
});

adminRouter.post("/dashboard/deleteproduct", isLoggedin, async (req, res, next) => {
    try {
        await Product.deleteOne({ _id: req.body.id })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        res.json({ msg: "product deleted" });
    } catch (error) {
        res.json({ error });
    }
});

adminRouter.get("/dashboard/editproduct/:id", isLoggedin, async (req, res, next) => {
    try {
        const productToEdit = await Product.findById(req.params.id);
        res.json(productToEdit);
    } catch (error) {
        res.json(error);
    }
});

adminRouter.post("/dashboard/editproduct/:id", isLoggedin, async (req, res, next) => {
    try {

        let doc = await Product.findOneAndUpdate(
            { _id: req.params.id },
            {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                price: req.body.price,
                category: req.body.category,
                category: req.body.category,
                rating: req.body.rating,
                brand: req.body.brand,
                featured: req.body.featured,
                createdBy: req.user.username,
            }
        );
     
        res.json(doc);
    } catch (error) {
        res.json(error);
    }
});


adminRouter.get("/dashboard/orders", isLoggedin, async (req, res, next) => {

    const ordersInDb = await Order.find({})
        .populate('userId' , 'username email' )
        .populate('order.items.productId' , 'name brand price' )
        .exec()
    res.json({ordersInDb})
});

adminRouter.get("/dashboard/members", isLoggedin, async (req, res, next) => {

    const membersInDb = await User.find({})
    res.json({membersInDb})
});

export default adminRouter;
