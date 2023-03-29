import express from "express";
import userModels from "../models/UsersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwtGenerator from "../util/jwtGenerator.js";
import Product from "../models/ProductsModel.js";
import { sendEmail } from "../util/sendEmail.js";
const { User, Order, Token } = userModels;
const userRouter = express.Router();

userRouter.post("/signin", async (req, res, next) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email: email });

    if (userExists) {
        const isAuth = await bcrypt.compare(password, userExists.password);
        if (isAuth) {
            //in case user exsist and has done the verification via email ====> create jwt and login ===> save token in cookies
            if (userExists.verified === true && isAuth === true) {
                let jwtToken = await jwtGenerator(userExists._id);
                res.cookie("token", jwtToken, { maxAge: 900000, httpOnly: true, secure: true , sameSite: 'none'});
                res.cookie("loggedIn", true, { maxAge: 900000, httpOnly: true, secure: true , sameSite: 'none'});
                res.json({
                    success: true,
                    token: jwtToken,
                });
            } else {
                // if verification is not completed yet , send the message in res ===> in frontend the res will be handled and redirect user to login page
                res.clearCookie("token");
                res.clearCookie("loggedIn");
                res.json({ msg: "Account is not verified yet, check your email", success: false });
            }
        } else {
            res.clearCookie("token");
            res.clearCookie("loggedIn");
            res.cookie("loggedIn", false, { expires: 'Thu, 01 Jan 1970 00:00:00 UTC', path: '/' , httpOnly: true, secure: true , sameSite: 'none'});
            res.cookie("token", jwtToken, { expires: 'Thu, 01 Jan 1970 00:00:00 UTC', path: '/' , httpOnly: true, secure: true , sameSite: 'none'});
            res.json({ msg: "Wrong email or password", success: false });
        }
    } else {
        res.clearCookie("token");
        res.clearCookie("loggedIn");
        res.json({ msg: "User not found", success: false });
    }
});

userRouter.post("/signout", async (req, res, next) => {
   
    res.clearCookie("token");
   res.clearCookie("loggedIn");
    res.status(200).send();
});

userRouter.post("/signup", async (req, res, next) => {
    const { email, password, adress, username, phone } = req.body;
    //check if email is already registered
    const isRegistered = await User.findOne({ email: email });
    if (isRegistered) {
        res.json({
            status: {
                msg: "email is already registered , did you forget your password ??",
                success: false,
                body: {},
            },
        });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const refreshToken = jwt.sign({ username: username }, "aaaaa", {
            expiresIn: "1d",
        });

        const newUser = await User.insertMany({
            username: username,
            email: email,
            password: hashedPassword,
            adress: adress,
            phone: phone,
            // role: 'admin', // will later make it dynamic and the admin can upgrade other users to admin
            refreshToken: refreshToken,
        });
        const verifiyToken = jwt.sign({ userId: newUser[0]._id }, "verifyToken", {
            expiresIn: "1d",
        });

        //-------------------------------------
        const token = await new Token({
            userId: newUser[0]._id,
            token: verifiyToken,
        }).save();
       // after regesiter is done , send a verification link to the user email.     
        const url = ` Welcome  ${newUser[0].username} ! Please click on the following link to verifiy your account : ${process.env.BASE_URL}/user/${newUser[0]._id}/verify/${token.token}`;
        await sendEmail(newUser[0].email, "Verfiy your email", url);

        // res.json('/signin')
        res.json({
            status: {
                msg: "new user created successfully",
                success: true,
                body: { email: email },
            },
        });
    }
    next();
});

userRouter.get("/getcart", async (req, res, next) => {
    if (req.user) {
        await req.user
            .populate("cart.items.productId")
            .then((user) => {
                res.json(user.cart);

                next();
            })
            .catch((err) => console.log(err));
    } else {
        res.json([]);
        next();
    }
});

userRouter.post("/addtocart", async (req, res, next) => {
    const { item } = req.body;
    if (item) {
        const itemInDb = await Product.findById(item._id);

        if (req.user) {
            await req.user.addToCart(itemInDb);
            await req.user
                .populate("cart.items.productId")
                .then((user) => {
                    res.json(req.user.cart);
                })
                .catch((err) => console.log(err));
            next();
        } else {
            res.json({ itemInDb });
        }
    }
});

userRouter.post("/increaseitem", async (req, res, next) => {
    const { id, price } = req.body;

    if (req.user) {
        await req.user.increaseItem(id, price);
        await req.user
            .populate("cart.items.productId")
            .then((user) => {
                res.json(req.user.cart);
            })
            .catch((err) => console.log(err));
        next();
    } else {
        const itemInDb = await Product.findById(id);
        res.json(itemInDb);
        next();
    }
});

userRouter.post("/decreaseitem", async (req, res, next) => {
    const { id, price } = req.body;
    if (req.user) {
        await req.user.decreaseItem(id, price);
        await req.user
            .populate("cart.items.productId")
            .then((user) => {
                res.json(req.user.cart);
            })
            .catch((err) => console.log(err));
        next();
    } else {
        const itemInDb = await Product.findById(id);
        res.json(itemInDb);
        next();
    }
});

userRouter.post("/deletefromcart", async (req, res, next) => {
    const { id, price } = req.body;
    if (req.user) {
        await req.user.deleteFromCart(id, price);
        await req.user
            .populate("cart.items.productId")
            .then((user) => {
                res.json(req.user.cart);
            })
            .catch((err) => console.log(err));
        next();
    } else {
        const itemInDb = await Product.findById(id);
        res.json(itemInDb);
        next();
    }
});

// after user clicks on link on the email, the token will be send with req ===> handle
userRouter.get("/:id/verify/:token", async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(400).send({ msg: "invalid link" });
        }

        // if the token is correct in db (Token schema)
        const token = await Token.findOne({ userId: req.params.id, token: req.params.token });

        if (!token) {
            return res.status(400).send({ msg: "invalid link" });
        }
        // the token is correct ===> find this user in db and update verified to true so he can login
        await User.findOneAndUpdate({ _id: user.id }, { verified: true });
        await Token.findOneAndRemove({ token: req.params.token });
        res.json({ msg: `Email ${user.email} is verified successfully !` });
    } catch (error) {
        console.log(error);
    }
});
// resend the verification link again to the email in input field
userRouter.post("/resend", async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // in case this email is not exist in db
        if (!user) {
            return res.status(400).send({ success: false, msg: "This email is not registered" });
        }
        // in case this email is already verified
        if (user.verified === true) {
            return res
                .status(400)
                .send({ success: false, msg: "This Account is already verified" });
        }
        // find token through user id ===> create new link and send it to this email
        const token = await Token.findOne({ userId: user._id });
        const url = `!! Welcome  ${user.username} ! Please click on the following link to verifiy your account : ${process.env.BASE_URL}/user/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verfiy your email", url);

        res.json({ success: true, msg: `New Verification link was sent to: ${user.email}` });
    } catch (error) {
        console.log(error);
    }
});

userRouter.get("/clearcart", async (req, res, next) => {
    if (req.user) {
        const orderItems = await req.user.cart.items.map((item) => {
            return {
                productId: item.productId,
                qty: item.qty,
            };
        });

        const order = await Order.insertMany({
            userId: req.user._id,
            order: {
                items: orderItems,
                total: req.user.cart.total,
            },
            shipped: false,
        });

        req.user.cart = { total: 0, items: [] };
        req.user.save();
        res.send(req.user);
    } else {
        res.json("you need to sign in");
    }
});

export default userRouter;
