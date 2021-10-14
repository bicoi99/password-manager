const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Remove route later, disable registering
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  const result = await user.save();
  const { password, ...data } = await result.toJSON();

  res.send(data);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  // If no user found
  if (!user) {
    return res.status(404).send({
      username: "Incorrect username",
      password: "",
    });
  }

  // Compare user password with hashed password in database
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({
      username: "",
      password: "Incorrect password",
    });
  }

  // Generate JWT token with user id
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  // Store token in cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.send({
    message: "Success",
  });
});

router.get("/user", async (req, res) => {
  // Get token from cookies
  const token = req.cookies["jwt"];

  // If no cookie, user is not authenticated
  if (!token) {
    return res.status(401).send({
      message: "Unauthenticated",
    });
  }

  // Decode token
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    // If token is invalid
    if (err) {
      return res.status(401).send({
        message: "Unauthenticated",
      });
    }

    // Find user by id in database
    const user = await User.findById(decoded._id);
    const { username } = await user.toJSON(); // do we need to return id as well?

    res.send(username);
  });
});

router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 }); // create new jwt cookie expires immediately

  res.send({ message: "Success" });
});

module.exports = router;
