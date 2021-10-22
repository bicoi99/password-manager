const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// router.post("/register", (req, res) => {
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) {
//       return res.status(500).send({
//         message: "Server error",
//       });
//     }
//     bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
//       if (err) {
//         return res.status(500).send({
//           message: "Server error",
//         });
//       }

//       const user = new User({
//         username: req.body.username,
//         password: hashedPassword,
//       });

//       user
//         .save()
//         .then((result) => {
//           return res.status(201).send(result);
//         })
//         .catch((err) => {
//           console.log(err);
//           return res.status(500).send({
//             message: "Server error",
//           });
//         });
//     });
//   });
// });

router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      // If username incorrect, no result from database
      if (!user) {
        return res.status(404).send({
          username: "Incorrect username",
          password: "",
        });
      }

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        // If result is false, incorrect password
        if (!result) {
          return res.status(400).send({
            username: "",
            password: "Incorrect password",
          });
        }

        // Generate JWT with user id
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        // Store token to cookie
        res.cookie("jwt", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.send({ message: "Success" });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: "Server error",
      });
    });
});

router.get("/user", (req, res) => {
  // Retrieve JWT from cookie
  const token = req.cookies.jwt;

  // If no cookie, user not authenticated
  if (!token) {
    return res.status(401).send({
      message: "Unauthenticated",
    });
  }

  // Decode
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // If token invalid
    if (err) {
      return res.status(401).send({
        message: "Unauthenticated",
      });
    }

    User.findById(decoded._id).then(({ username }) => {
      return res.send(username);
    });
  });
});

router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });

  return res.send({ message: "Success" });
});

module.exports = router;
