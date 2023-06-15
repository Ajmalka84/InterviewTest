const router = require("express")();
const User = require("../Model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// register
router.post("/register", async (req, res) => {
  console.log(req.body);
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(req.body.password, salt);
  const newUser = new user({
    email: req.body.email,
    password: hashedPassword,
  });
  await newUser.save();
  console.log(newUser);
  res.status(200).json(newUser);
});

// login
router.post("/login", async (req, res) => {
    try {
        console.log(req.body)
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.status(400).json("user not found");
        }
  
        let validatePassword = bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!validatePassword) {
          return res.status(400).json("wrong password");
        }
        const payload = user._doc;
        console.log(payload)
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: "2h",
        });
          const userDetails = { accessToken: accessToken };
        res.json(userDetails);
      } catch (error) {
        res.json(error);
      }
});

function adminVerify (req, res, next) {
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token == null) return res.sendStatus(401);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (error, user) => {
        if (error) {
          console.log(error, "error is here");
          return res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("you are not authenticated");
    }
  }

router.get("/home" , adminVerify, (req, res)=>{
    console.log("its here")
    res.json("succes")
})

module.exports = router;
