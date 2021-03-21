const router = require('express').Router();
const users = require('./auth-model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../secrets");
const bcrypt = require("bcryptjs");

router.post('/register', async (req, res, next) => {
  // res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
 try {
 const { username, password } = req.body

 if (!username || !password){
   return res.status(409).json({
     message: "username and password required",
   })
 }

 const userCheck = await users.findByUsername(username)
 if (userCheck){
   return res.status(409).json({
     message: "username taken"
   })
 }

 const hashedPW = await bcrypt.hash(password, 4)

 const newUser = await users.create({
   username,
   password: hashedPW,
 })

 res.status(201).json({
  user_id: newUser.user_id, 
  username: newUser.username, 
  password: newUser.password,
})

 } catch (err) {
   next(err)
 }

});

router.post('/login', async (req, res, next) => {
  // res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
 try {
  const { username, password } = req.body

  if (!username || !password){
    return res.status(409).json({
      message: "username and password required",
    })
  }

  const user = await users.findByUsername(username)
 
  if (!user){
   return res.status(409).json({
     message: "invalid credentials"
   })
 }

  const passwordValid = await bcrypt.compare(password, user.password)

  if (!passwordValid) {
    return res.status(401).json({
      message: "invalid Credentials",
    })
  }

  const token = jwt.sign({
    username: user.username,
  }, JWT_SECRET)

  res.cookie("token", token)
  res.status(200).json({
    message: `Welcome, ${user.username}`,
    token: token,
  })

 } catch (err) {
   next(err)
 }
});

module.exports = router;
