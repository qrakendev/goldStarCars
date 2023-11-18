var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var ElectricModel = require("../models/ElectricModel");
const GasModel = require('../models/GasModel');

router.use(express.static("public"));


router.get('/', async function (req, res) {
    try {
        const makes = await GasModel.distinct('title');
        const models = await GasModel.distinct('t1',);
        const modelVariants = await GasModel.distinct('t2');
        const years = await GasModel.distinct('year');
        const colors = await GasModel.distinct('colour');
    
        res.render('search.hbs', {
          makes,
          models,
          modelVariants,
          years,
          colors
        });
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      }
    });

router.get('/search-results', async function (req, res) {
    let electric_models = await GasModel.find(req.body.make);
    res.render("search_index.hbs", { models: electric_models });
})

module.exports = router;
