const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');


/* GET weather listing. */
router.get('/', async (req, res, next) => {
  try{
    const weatherData = await weatherController.getWeatherForecast(); 
    res.status(200).json({data:weatherData});
  } catch (e) {
    //this will eventually be handled by the error handling middleware
    console.log(e);
    next(e); 
  }
});

module.exports = router;
