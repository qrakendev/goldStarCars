var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
var GasModel = require("../models/GasModel");
var custom = require("../models/CustomerModel");

router.use(express.static("public"));


// GET Gas Cars
router.get('/', async function (req, res) {

    try {
        let gas_models = await GasModel.find();
        let images = gas_models.imagePath
        const makes = await GasModel.distinct('title');
        console.log(makes)
        res.render("gas_index.hbs", { 
            CARmodels: gas_models, 
            images: gas_models.imagePath,
            makes: makes,
            sortBy: true
            
        });
    
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
      }
    });

    router.post('/', async function (req, res) {
        try {
            // Initial query for all gas models
            let gas_models = await GasModel.find();
            const makes = await GasModel.distinct('title');

            // Access filtering parameters from the request body
            const {sortBy, priceBy, make, year, yearLt, mileageR, trans, drive, cyl } = req.body;
    
            // Apply filtering logic based on the parameters
            if (sortBy == 'Latest Year') {
                gas_models = gas_models.sort((a, b) => b.year - a.year);
            } else if (sortBy == "Oldest Year") {
                gas_models = gas_models.sort((a, b) => a.year - b.year);
            } else if (sortBy == 'Highest Price') {
                gas_models = gas_models.sort((a, b) => b.price - a.price);
            } else if (sortBy == 'Lowest Price') {
                gas_models = gas_models.sort((a, b) => a.price - b.price);
            } // Add other sorting conditions here

            if (make !== undefined && make !== null && make !== 'Make') {
                gas_models = await GasModel.find({title: make})
            }

            if (mileageR !== undefined && mileageR !== null && mileageR !== 'Mileage') {
                if (mileageR == 100001) {
                    // If mileageR is 100,001, find GasModels with mileage greater than or equal to it
                    gas_models = await GasModel.find({ totalMiles: { $gte: mileageR } });
                } else {
                    // Find GasModels with mileage less than mileageR
                    gas_models = await GasModel.find({ totalMiles: { $lt: mileageR } });
                }
            }

            res.render("gas_index.hbs", { 
                sortByLY: sortBy == "Latest Year" ? true : false,
                sortByOY: sortBy == "Oldest Year" ? true : false,
                sortByHP: sortBy == "Highest Price" ? true : false,
                sortByLP: sortBy == "Lowest Price" ? true : false,
                sortByR: sortBy == "Relevance" ? true : false,
                sortBy: sortBy == "Sort By" ? true : false,
                sortBy: sortBy == "" ? true : false,
                milage1: mileageR == 10000 ? true : false,
                milage2: mileageR == 25000 ? true : false,
                milage3: mileageR == 50000 ? true : false,
                milage4: mileageR == 75000 ? true : false,
                milage5: mileageR == 100000 ? true : false,
                milage6: mileageR == 100001 ? true : false,
                make: make,
                CARmodels: gas_models, 
                images: gas_models.map(model => model.imagePath),
                makes: makes
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred');
        }
    });




// GET Booked Model
router.get('/booknow/:id', async function (req, res) {

    let modelid = req.params.id;
    console.log(modelid);

    let booked_model = await GasModel.findById(modelid);
    console.log(booked_model.imagePath);
    //console.log(booked_model);
    let carImages = booked_model.imagePath.filter(item => item !== "");
    console.log(carImages)
    res.render("gasbooking.hbs", { 
        model: booked_model,
        images: carImages
    });

});

router.get('/filter/booknow/:id', async (req, res) => {
    let modelid = req.params.id;
    res.redirect('/gas/booknow/' + modelid);
});
 

module.exports = router;