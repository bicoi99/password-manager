const router = require("express").Router();
const Password = require("../models/Password");
const { encrypt, decrypt } = require("../utils/encryption");
const { requireAuth } = require("../middleware/authMiddleware");

// @desc    Create new password and assign to user specify by JWT token
// @route   POST /password
// @access  Private
router.post("/", requireAuth, (req, res) => {
  // Extract info from request
  const { appName, username, password } = req.body;
  // Encrypt the plain text password, stores iv used
  const { iv, encryptedPassword } = encrypt(password);
  // Create new document, userId generated in middleware
  const passwordObject = new Password({
    appName,
    username,
    encryptedPassword,
    iv,
    userId: res.locals.decodedToken._id,
  });
  // Save new document, then send back result without sensitive info
  passwordObject
    .save()
    .then(({ _id, appName, username }) => {
      res.send({ _id, appName, username });
    })
    .catch((error) => {
      console.log(error);
    });
});

// @desc    Get all passwords belonging to user specified by JWT token
// @route   GET /password
// @access  Private
router.get("/", requireAuth, (req, res) => {
  // Find all documents with same userId, extracted from middleware
  Password.find({ userId: res.locals.decodedToken._id }, (err, docs) => {
    if (err) {
      console.log(err);
    }
    // Send back data with no sensitive info. If no documents, empty array is sent back
    res.send(
      docs.map(({ _id, appName, username }) => {
        return { _id, appName, username };
      })
    );
  });
});

// @desc    Get decrypted password for specified id
// @route   GET /password/:id
// @access  Private
router.get("/:id", requireAuth, (req, res) => {
  // Find the document with id specified in url
  Password.findById(req.params.id, (err, doc) => {
    // If error encounter or no results found
    if (err || !doc) {
      return res.status(404).send({
        message: "Invalid id",
      });
    }
    // If current user is trying to get password belonging to another user
    if (doc.userId !== res.locals.decodedToken._id) {
      return res.status(403).send({
        message: "Unauthorised",
      });
    }
    // Send back the decrypted password
    return res.send(decrypt(doc.iv, doc.encryptedPassword));
  });
});

// @desc    Update the password with specified id
// @route   PUT /password/:id
// @access  Private
router.put("/:id", requireAuth, (req, res) => {
  // Find the document with id specified in url
  Password.findById(req.params.id, (err, doc) => {
    // If error encounter or no results found
    if (err || !doc) {
      return res.status(404).send({
        message: "Invalid id",
      });
    }
    // If current user is trying to get password belonging to another user
    if (doc.userId !== res.locals.decodedToken._id) {
      return res.status(403).send({
        message: "Unauthorised",
      });
    }
    // Extract info from request
    const { appName, username, password } = req.body;
    // Encrypt new password and save iv
    const { iv, encryptedPassword } = encrypt(password);
    // Update document
    doc.appName = appName;
    doc.username = username;
    doc.encryptedPassword = encryptedPassword;
    doc.iv = iv;
    // Save document and send back non-sensitive info
    doc
      .save()
      .then(({ _id, appName, username }) => {
        return res.send({ _id, appName, username });
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Server error",
        });
      });
  });
});

// @desc    Delete the password with specified id
// @route   DELETE /password/:id
// @access  Private
router.delete("/:id", requireAuth, (req, res) => {
  // If error encounter or no results found
  Password.findById(req.params.id, (err, doc) => {
    // If error encounter or no results found
    if (err || !doc) {
      return res.status(404).send({
        message: "Invalid id",
      });
    }
    // If current user is trying to get password belonging to another user
    if (doc.userId !== res.locals.decodedToken._id) {
      return res.status(403).send({
        message: "Unauthorised",
      });
    }
    // Delete the document and send appropriate response
    doc.remove((err) => {
      if (err) {
        return res.status(500).send({
          message: "Server error",
        });
      } else {
        return res.send({
          message: "Success",
        });
      }
    });
  });
});

module.exports = router;
