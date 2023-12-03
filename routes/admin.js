const express = require('express');
const router = express.Router();
const multer = require('multer');
const ElectricModel = require("../models/ElectricModel");
const GasModel = require('../models/GasModel');
const CustomerModel = require('../models/CustomerModel');
const UserModel = require("../models/UserModel");
const PartEx = require('../models/PartEx');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const onHeaders = require('on-headers');
const Imports = require('../models/Imports');
const ContactModel = require('../models/ContactModel');
require('dotenv').config();

let globalToken = '';


// Set Image Storage
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);


    }
});
// Init Upload
const upload = multer({
    storage: storage
}).array('imageupld');



router.use(express.static("public"));



// GET Root Route - Admin login
router.get('/', function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

// GET Login Error
router.get('/login_error', function (req, res) {
    res.sendFile(__dirname + "/loginerror.html");
});

const revokedTokens = [];

// POST Admin login
router.post("/login", async function (req, res) {

    let id = req.body.userid;
    let pass = req.body.password;

    let user = await UserModel.findOne({ userID: id });

    if (user) {
      // Compare the provided password with the stored hashed password
      console.log(pass)
      console.log(user.password)
      bcrypt.compare(pass, user.password, (err, result) => {
        if (result) {
          // Passwords match, generate JWT token
          const token = jwt.sign({ username: user.username, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
           
          globalToken = token;
          window.sessionStorage.setItem("token", token)
          console.log(globalToken);

        res.redirect("/admin/home");

        } else {
          // Passwords don't match, authentication failed
          res.status(401).json({ error: 'Invalid username or password. here' });
        }
      });
    } else {
      // User not found, authentication failed
      res.status(401).json({ error: 'Invalid username or password.' });
    }
});

router.get("/signout", authorizeToken, async function (req, res){
    globalToken = '';
    res.redirect("/")
})

function authorizeToken( req, res, next) {
        
    const token = window.sessionStorage.getItem("token")
    console.log("global", globalToken)
    console.log(token)

    if (token) {
      // Check if the token is revoked
      if (revokedTokens.includes(token)) {
        return res.status(401).json({ error: 'Token has been revoked.' });
      }
  
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          res.status(401).json({ error: 'Invalid token.' });
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      res.status(401).json({ error: 'No token provided.' });
    }
  }


// GET - Home Page
router.get('/home', authorizeToken, (req, res) => {
        res.sendFile(__dirname + "/admin_home.html");
});

//GET Admin Index
router.get(`/admin_index`, authorizeToken, async function (req, res) {
    console.log(globalToken)
    res.render("admin/admin_index", { layout: false });
});


// GET Electric Cars
router.get('/electric', authorizeToken, async function (req, res) {

    let electric_models = await ElectricModel.find();
    res.render("admin/electric_list", { list: electric_models, layout: 'layout_list' });
});


// Get Add electric Cars Form Page
router.get('/addelectric', authorizeToken, (req, res) => {
    res.render("admin/electric_form", { layout: false });
});


// POST Electric Car Form
router.post('/addelectric', authorizeToken, async function (req, res) {

    let electric = new ElectricModel(req.body);

    result = await electric.save();
    console.log(result);

    res.redirect('/admin/electric');

});


// Delete Electric Car
router.get('/deleteelectric/:id', authorizeToken, async function (req, res) {

    const result = await ElectricModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/electric');
});




// GET Gas Cars
router.get('/gas', authorizeToken, async function (req, res) {

    let gas_models = await GasModel.find();
    res.render("admin/gas_list", { list: gas_models, layout: 'layout_list' });
});


// Get Add Gas Cars Form Page
router.get('/addgas', authorizeToken, (req, res) => {
    res.render("admin/gas_form", { layout: false });
});

// POST Gas Car Form
router.post('/addgas', authorizeToken, async function (req, res) {

    try {
        console.log(req.body.imagePath)
        req.body.imagePath = req.body.imagePath.map(fileName => 'images/' + fileName);
        console.log(req.body.imagePath)
        let gas = new GasModel(req.body);

        result = await gas.save();
        console.log(result);
    
        res.redirect('/admin/gas');
    
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

});


// Delete Gas Car
router.get('/deletegas/:id', authorizeToken, async function (req, res) {

    const result = await GasModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/gas');
});







// GET Customers
router.get('/customers', authorizeToken, async function (req, res) {

    let customers = await CustomerModel.find();
    res.render("admin/customers_list", { list: customers, layout: false });
});

router.get('/contact', authorizeToken, async function (req, res) {

    let contact = await ContactModel.find();
    res.render("admin/contact_list", { list: contact, layout: false });
});

// Delete User
router.get('/deletecustomer/:id', async function (req, res) {

    const result = await CustomerModel.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/customers');
});

//GET Partex
router.get('/partex', authorizeToken, async function (req, res) {
    let partex = await PartEx.find();
    res.render("admin/partex_list", {list: partex, layout: false})
})

//GET Import
router.get('/import', authorizeToken, async function (req, res) {
    const importType = await Imports.find();
    res.render("admin/import_list", {list: importType, layout: false})
})

// Delete Partex
router.get('/deletepartex/:id', authorizeToken, async function (req, res) {

    const result = await PartEx.findByIdAndRemove(req.params.id);
    console.log(result);

    res.redirect('/admin/partex');
});






// Image Handling

// Get Upload Image Form Page
router.get('/images', authorizeToken, (req, res) => {
    res.render("admin/images_upload", { layout: false });
});


// POST Image File
router.post('/uploadimage', authorizeToken, (req, res) => {
    upload(req, res, (err) => {

        if (err) {
            img = { err: err };
            console.log(img);
            res.render('admin/images_upload', { img: img, layout: false });
        }
        else {
            if (req.file == undefined) {
                img = { err: "No File Uploaded" }
                res.render('admin/images_upload', { img: img, layout: false });
            }
            else {
                console.log(req.file);
                res.redirect("/admin");
            }
        }

    });

});



module.exports = router;