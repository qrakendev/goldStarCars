var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var contactmodel = require('../models/ContactModel')

router.use(express.static("public"));


router.get('/', async function (req, res) {

    res.render("contact.hbs");
});

router.post('/addContact', async function (req, res) {
    let contact = new contactmodel(req.body)
    result = await contact.save();
    res.render("about.hbs");

})

module.exports = router;
