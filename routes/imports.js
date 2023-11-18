var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var importsModel = require("../models/Imports");

router.use(express.static("public"));


router.get('/', (req, res) => {
    res.render("imports.hbs");
});

router.post('/addimport', async function (req, res) {

    let imports = new importsModel(req.body);
    console.log(imports);
    result = await imports.save();
    console.log(result);
    res.redirect('/home');

});

module.exports = router;