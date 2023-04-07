# DigitalBazzar

DigitalBazzar is a full-stack e-commerce application built to simulate real-world functionality. This app has almost all the important features of a real e-commerce site. The application was built over a period of 6 weeks to test my knowledge and skills in various technologies.

## Functionality

DigitalBazzar provides a user-friendly interface and several features for users, including:

- Add product to cart
- Filter or search products by brand
- Sort By Price ASC/DESC
- Delete product or increase quantity
- Register for new account and verify email
- Login and checkout using Stripe payment gateway
- Resend verification email if needed
- Protected admin dashboard to manage orders, members, and products
- Admin can add, update, and delete products
- Admin can make products featured to display on homepage

## Technologies Used:
DigitalBazzar was built using the following technologies:

- Node.js with Express for the backend
- Axios for fetching data and supporting older browsers
- Bcrypt to encrypt passwords
- Cookie parser to read cookies
- JSON Web Token to verify tokens for email verification and sign-in
- Nodemailer to send verification links
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) for the database
- Mongoose to define relations and operate on the database
- Stripe for payments

## Demo:
Online Deployment of this project is available at:    [Digital-Bazzar](https://digital-bazzar.netlify.app/) <br>

You can use these credentials to log in as an admin and explore the admin features. Additionally, new accounts can be created and verified.

| Email  | Password  |
|-----------|-----------|
| admin | 123123123 |

To test checkout and stripe getway the following creditcard can be used to place order and fulfill a payment.
| Card Number             | End    | CVC |
|------------------------|--------|-----|
| 4242 4242 4242 4242     | 11-33  | 333 |



## Future Plans and Improvements for DigitalBazzar:
- Implementing Stripe webhooks to handle the checkout and order creation process. When a payment is successfully processed, the webhook will send a request to the DigitalBazzar backend. I will create an API to handle this request, and only after receiving it, will the order be created in the database.

- Adding a feature for the admin to upgrade a regular user to an admin. Additionally, I will implement CRUD operations for orders and members within the admin dashboard.

- Improving the design of the featured collection on the homepage using the Three.js library.

## Note:
The app uses cookies to store authentication tokens, which are deleted when the user logs out. The token has a lifespan of 15 minutes, after which the user will need to log in again for continued access.


## Screenshots:
![Screenshot of DigitalBazzar homepage](https://github.com/Tarek666666/DigitalBazzar-backend/blob/master/screenshots/home.png)
![Screenshot of DigitalBazzar homepage](https://github.com/Tarek666666/DigitalBazzar-backend/blob/master/screenshots/home-dark.png)
