---
title: "User Authorization in NodeJS using PostgresSQL"
date: "2021-07-28"
description: 'Authorizing users in NodeJS'
---

## User Authorization in NodeJS using PostgreSQL

User authentication is one of the integral parts while developing a web application. Although we can use third party apps like [Firebase](https://firebase.google.com/) or [Passport](http://www.passportjs.org/) to authenticate our user, but in this blog we'll use a simple and self-developed approach by creating REST API's using NodeJS and PostgreSQL which will help us to understand fundamentals of authentication.

### Prerequisites and Technologies Used

 - [ ] nodeJS
 - [ ] nodemon
 - [ ] express
 - [ ] cors
 - [ ] pg
 - [ ] bcrypt
 - [ ] jwt
 - [ ] dotenv 
#### Also it is preferred to have an account on [ElephantSQL](https://www.elephantsql.com).
 ### Basic Structure

Once you have all the dependencies set up you can start by first making a folder structure. Here we will be MVC folder structure, which stands for Model --> View --> Controller type of structure. Here we will be making different folders for each task.

In your root directory run the following command

```powershell
touch server.js
mkdir routes controller routes configs
```
These will create all the folder that we will be required to authorize our users. server.js will be our root file where we will be initiating our server with the help of ExpressJS.

>
>It might be daunting for few, but stick with me till the end and you'll surely get an idea how to create your server and how to work through it authorizing and authenticating new users to your application.

### Starting Our Server

In our main server.js file we will be structuring our server.
Our server.js should look like
```java
const  express  =  require("express");

const app = express(); //Initialized express

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {

res.status(200).send("Engine Started, Ready to take off!");

})

app.listen(port, () => {

console.log(`Here we go, Engines started at ${port}.`);

})
```
Here we added *cors* which enables cross origin sharing of resources. You can learn more about it [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).
Here we *process.env.port* looks for any free port to run our server locally if our port is not free as in our case port 5000. We can check if our server is running properly by running *localhost:5000*.

### 'Users' table schema in PostgresSQL

To create our users table now we can run postgres locally too, but in this blog we are using blog post to ease connecting it remotely with our backend. After creating an account on ElephantSQL, copy the database URL from the details section to your clipboard.
We have to run the following SQL queries to create our users table.
```sql
CREATE TABLE "users" (

"id" SERIAL PRIMARY KEY,

"name" text NOT NULL,

"email" text NOT NULL UNIQUE,

"phonenumber" text NOT NULL UNIQUE,

"password" varchar NOT NULL,

);
```
Users that register themselves should have **a unique E-mail and a unique phone-number** to prevent multiple registrations of same users, and spamming of user-bots. 

Now we will have our users table where we can store our users information.

### Working with our Node App

Now as we have constructed our database we need to configure and connect it to our server. In our project directory we will direct ourselves too *configs* directory and create two files *database.js* and *dotenv.js*.

Before adding our Postgres Credentials we will make a new file .env in our root directory to store all the values as Enviornment variables so if any other person gets our code they wont be able to access our credentials.

In our .env, add the following lines

```java
DB_URL = paste your database URL here
```
Now in our *dotenv,js* we will add the following lines
```java
if (process.env.NODE_ENV !== 'production') {

require('dotenv').config() //Configuring dotenv during development stage

}
```
which means that if we are in a development stage server has to configure our dotenv files.

Now to connect our database to our backend we have to add these lines in our *database.js* to configure our postgres database.

```java
const { Client } = require("pg");

const client = new Client(process.env.DB_URL); //Configuring PostgresSQL Database

module.exports = client;
```

Now as we have configured our database, to connect this to our database we have to add these lines to our *server.js*.

```java
require("./configs/dotenv");
const  client  =  require("./configs/database");

client.connect((err) => { //Connected Database

if (err) {

console.log(err);

}

else {

console.log("Data logging initiated!");}

});
```

By doing so through our console we'll get to know whether we are connected to our database or not on our local host.

### Making and Routing our User endpoint

In our *server.js* we will add the folling lines of code, just to tell the server that whenever we fetch /users it has to run our *user* method.

```java
const  user  =  require("./routes/user");

app.use("/user",  user);  //Route for /user endpoint of API
```
Here we can make multiple endpoints for different tasks.

> We'll know what routes/user is in the following section.

Now in our *routes* directory we will make *users.js* and add the following code

```java
const express = require('express');

const router = express.Router();

const {register} = require("../controllers/register");

const {login} = require("../controllers/login");

router.post('/register' , register); //POST request to register the user

router.post('/login' , login); // POST request to login the user

module.exports = router;
```

Here we are telling the server to go to these endpoints and make requests based on corresponding methods.

For example :- If our user fetches at /user/register our server will make a *POST* request on our *register* method which we will write in our next section.

 

> If you have gotten this far in this blog, tap yourself on the back as you have created your own server, have set your own enviornment variables, created, configured and connected your own postgreSQL database to your server and have completed your first step in authorizing users to your web applications.

>I promise you it gets more intresting from here and you will be writing functions that will work on Real World Projects and you'll fell in love with it. 

### Registering Users to our App

In our *controllers* directory we will create *register.js* where we will add function to register our user.

Here we will be making SQL queries such that to prevent SQL injection. Intrested people can know more about SQL injection from [here](https://portswigger.net/web-security/sql-injection) and will be doing error handling at each step, also wil be using try-catch methods to write the functions.

Before moving forward with our function we need to update our *.env* file.
We will add follwoing variables to our *.env* file
```curl
SECRET_KEY = any random string here

```

In *register.js* we will add the following code

```java
const  bcrypt  =  require("bcrypt");

const  client  =  require("../configs/database");

const  jwt  =  require("jsonwebtoken");

//Registration Function

exports.register  =  async (req, res) => {
const { name, email, phonenumber, password } =  req.body;
try {
const  data  =  await client.query(`SELECT * FROM users WHERE email= $1;`, [email]); //Checking if user already exists
const  arr  =  data.rows;
if (arr.length  !=  0) {
return  res.status(400).json({
error: "Email already there, No need to register again.",
});
}
else {
bcrypt.hash(password, 10, (err, hash) => {
if (err)
res.status(err).json({
error: "Server error",
});
const  user  = {
name,
email,
phonenumber,
password: hash,
};
var  flag  =  1; //Declaring a flag

//Inserting data into the database

client
.query(`INSERT INTO users (name, email, phonenumber, password) VALUES ($1,$2,$3,$4);`, [user.name, user.email, user.phonenumber, user.password], (err) => {

if (err) {
flag  =  0; //If user is not inserted is not inserted to database assigning flag as 0/false.
console.error(err);
return  res.status(500).json({
error: "Database error"
})
}
else {
flag  =  1;
res.status(200).send({ message: 'User added to database, not verified' });
}
})
if (flag) {
const  token  = jwt.sign( //Signing a jwt token
{
email: user.email
},
process.env.SECRET_KEY
);
};
});
}
}
catch (err) {
console.log(err);
res.status(500).json({
error: "Database error while registring user!", //Database connection error
});
};
}
```

This code will register your user in your database, we can test this endpoint on Postman or ThunderClient extension on VS code.

We'll understand this code in next section.

### Understanding Registration function

To understand our registration function we'll break it into different blocks.

**Block 1 :  Checking if user is already present in our database**
```java
const  data  =  await client.query(`SELECT * FROM users WHERE email= $1;`, [email]); //Checking if user already exists
const  arr  =  data.rows;  
if (arr.length  !=  0) {
return  res.status(400).json({
error: "Email already there, No need to register again.",
});
}
...
```
Here we are querying our client i.e. is our database to check where user's email is already present in our database or not. Then we check whether the response of this query's rows has some length (If email is present) or not.

If length is 0, we give an error response to the user stating that he need not register again.

**Block 2 : Hashing user's Password**

```java
bcrypt.hash(password, 10, (err, hash) => {
if (err)
res.status(err).json({
error: "Server error",
});
const  user  = {
name,
email,
phonenumber,
password: hash,
};

...
```

Here we uses bcrypt to hash user's password so if any third-party gets our database our user's password are safe and secure and cannot be cracked by third-party. *10* parameter is in the function is the number of salt rounds this function does to store the password. 
You can know more about bcrypt from [here](https://www.npmjs.com/package/bcrypt).

Then we are making a user object to store all the inputted values and hashed password of the user.

**Block 3 :  Inserting User's Information in our Database**

```java
var  flag  =  1; //Declaring a flag

//Inserting data into the database

client
.query(`INSERT INTO users (name, email, phonenumber, password) VALUES ($1,$2,$3,$4);`, [user.name, user.email, user.phonenumber, user.password], (err) => {

if (err) {
flag  =  0; //If user is not inserted is not inserted to database assigning flag as 0/false.
console.error(err);
return  res.status(500).json({
error: "Database error"
})
}
else {
flag  =  1;
res.status(200).send({ message: 'User added to database' });
}
})

...
```

Here we are querying through our database and inserting our user's data with the hashed password. Also here we are declaring a variable named flag which will act as boolean for the following section.

**Block 4 : Signing JSON Web Token for each User**
```java
if (flag) {
const  token  = jwt.sign( //Signing a jwt token
{
email: user.email
},
process.env.SECRET_KEY
);
};

...
```

Here if our User is registered to our database (Boolean  *flag* checks this) we sign a Json Web Token for the user. Json Web Token offers signature and encrypts data given to it. In our case we are encrypting user's email to identify it later on whenever user signs into our application. 
*process.env.SECRET_KEY* is the enviornment variable in our .env file which gives a random string with jwt functions encrypts our data.

If you are intrested you can know more about jwt from [here](https://jwt.io/) or refer to its package documentation from [here](https://www.npmjs.com/package/jsonwebtoken)

Now as we are through with registering our user we can check these endpoint, by making POST request on /users/register and inputting required data.

<hr />

> Hurrayy!! 🥳🥳🥳
> As of now you have developed your own backend to register your users and that too by following best practices out there.
> You have prevented SQL-Injections,  You have done good error handling and securely stored user's data in your database.

> Now we will see how to Sign In our user into our application.

### Signing In Users to our App
In our  _controllers_  directory we will create  *login.js*  where we will add function to sign in our user.

Here we will be making SQL queries such that to prevent SQL injection. Intrested people can know more about SQL injection from  [here](https://portswigger.net/web-security/sql-injection)  and will be doing error handling at each step, also wil be using try-catch methods to write the functions.

We will add the following code to ur *login.js* file
```java
const bcrypt = require("bcrypt");

const client = require("../configs/database");

const jwt = require("jsonwebtoken");

//Login Function
exports.login = async (req, res) => {
const { email, password } = req.body;
try {
const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [email]) //Verifying if the user exists in the database
const user = data.rows;
if (user.length === 0) {
res.status(400).json({
error: "User is not registered, Sign Up first",
});
}
else {
bcrypt.compare(password, user[0].password, (err, result) => { //Comparing the hashed password
if (err) {
res.status(500).json({
error: "Server error",
});
} else if (result === true) { //Checking if credentials match
const token = jwt.sign(
{
email: email,
},
process.env.SECRET_KEY
);
res.status(200).json({
message: "User signed in!",
token: token,
});
}
else {
//Declaring the errors
if (result != true)
res.status(400).json({
error: "Enter correct password!",
});
}
})
}
} catch (err) {
console.log(err);
res.status(500).json({
error: "Database error occurred while signing in!", //Database connection error
});
};
};
```
This code will sign in your user in your database, we can test this endpoint on Postman or ThunderClient extension on VS code.

We'll understand this code in next section.

### Understanding Sign In function

To understand our sign in function we'll break it into different blocks.

**Block 1 : Checking if User registered to our application or not**

```java
const { email, password } = req.body;
try {
const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [email]) //Verifying if the user exists in the database
const user = data.rows;
if (user.length === 0) {
res.status(400).json({
error: "User is not registered, Sign Up first",
});
}

...
```

Here we are querying through our database and checking if the user inputted values are present in our database or not. If our query's response has length *0*, which means there is no user with these credentials it throws an error.

 **Block 2 : Comparing Hashed Password with User's Password**
 ```java
 else {
bcrypt.compare(password, user[0].password, (err, result) => { //Comparing the hashed password
if (err) {
res.status(500).json({
error: "Server error",
});
} else if (result === true) { //Checking if credentials match
const token = jwt.sign(
{
email: email,
},
process.env.SECRET_KEY
);
res.status(200).json({
message: "User signed in!",
token: token,
});
}

...
```

Here if user is present in our database we are using *compare* method of bcrypt to check where user inputted password and user's password in database are equal or not.

And if these both passwords are equal we sign a JWT token for the user, where we encrypt user's email.

**Block 3 : Handling Errors While Signing in the User**
```java
else {
//Declaring the errors
if (result != true)
res.status(400).json({
error: "Enter correct password!",
});
}
})
}
} catch (err) {
console.log(err);
res.status(500).json({
error: "Database error occurred while signing in!", //Database connection error
});
};
``` 
In this part of the code we are telling the user if there is any error while logging him in the application be it related to his credentials or if it is related to database.

Now as we are through with signing in our user we can check these endpoint, by making POST request on /users/loigin and inputting required data.

If everything is done well Response 200 OK will be there and you have successfully authorized and authenticated user without using third party apps on your own.

> It's time to celebrate as you have done pretty well and gained a lot of knowledge about how to work with node and express and other technologies and work your way out.
> There is much more to User Authentication and this is just your beginning. You have learnt so much now explore on your own

### What more you can do now?

 - Validate User's Email, Password and Phone Number using RegEx.
 - Verify User's Email by sending mails to the user using NodeMailer.
 - Prevent different attacks like XSS attacks on your server.
 - Add more endpoints and learn about middlewares.

> This is my first blog and a small contribution for the community, some love would be appreciated ♥

You can contact me [here](mailto:shreshthg30@gmail.com) regarding any criticism or any questions. 
