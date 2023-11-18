var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var partexModel = require("../models/PartEx");

router.use(express.static("public"));


router.get('/', (req, res) => {
    res.render("partex.hbs");
});

router.post('/addpartex', async function (req, res) {

    let partex = new partexModel(req.body);
    console.log(partex);
    result = await partex.save();
    console.log(result);
    res.redirect('/home');

});

module.exports = router;
