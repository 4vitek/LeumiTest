const request = require('request');
const async   = require("async");
const moment  = require('moment');
const       _ = require('lodash');
const weatherToCsvService = require('../services/weatherToCsvService');

//Usually goes to config file
const apiKey    = 'fff9f900987a05902f07d757aba5540f';
const citiesArr = ['jerusalem','new york','dubai','lisbon','oslo','paris','berlin','athens','seoul','singapore'];

//function for fetching 5 day / 3 hour forecast data from external api
module.exports.getWeatherForecast = () => {
    return new Promise((resolve,reject) => {
        let accumulateddArr = [];
        async.each(citiesArr,(city, asyncCallback) => {  
            let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
            request(url,(err, response, body) => {
                if(err){
                    console.log('error:', error);
                    asyncCallback(error);
                } else { 
                    let forcastObj = JSON.parse(body);
                    if(!forcastObj || forcastObj.list.length === 0){
                        console.log(`got empty response from weather api`);
                        return reject();
                    }
                    //making order in response
                    for(var i = 0; i < forcastObj.list.length;i++){
                        forcastObj.list[i].city = forcastObj.city.name;
                        let tempDate = moment(forcastObj.list[i].dt_txt, "YYYY-MM-DD");  // explicit input format
                        forcastObj.list[i].date = tempDate.format("ddd MMM DD YYYY")
                        accumulateddArr.push(forcastObj.list[i]);
                    }     
                    asyncCallback();
                }
            })
            },async(err) => {
                if(err){
                    console.log("getting forecast failed:" + err);
                    reject();
                }else{
                    let csvDTOs = [];
                    try{
                       //groupping by date
                       accumulateddArr = _(accumulateddArr)
                        .groupBy(x => x.date)
                        .map((value, key) => ({date: key, weather: value}))
                        .value();

                          //prepairing data for csv storage
                        _.forEach(accumulateddArr, d => {
                            let maxTemperatureObj = getMaxTempObj(d.weather);
                            let minTemperatureObj = getMinTempObj(d.weather);
                            let citiesRain        = getRainCities(d.weather);

                            csvDTOs.push({day:d.date,maxCityTempr:maxTemperatureObj.city,
                                          minCityTempr:minTemperatureObj.city,
                                          citiesRain:citiesRain
                                        });
                        });
                     
                        let result   = await weatherToCsvService.saveCsv(csvDTOs);
                        //also will send data to the client
                        resolve({weatherList:csvDTOs});
                    }catch(error){
                        reject(error);
                    }
                }
        });
    });
}

//getting max temperature Object for csv
let getMaxTempObj = (arr)=>{
    let max = -Infinity, key;  
    arr.forEach((v, k) => { 
        if (max < +v.main.temp_max) { 
            max = +v.main.temp_max; 
            key = k; 
        }
    });
    return arr[key];
}
//getting min temperature Object for csv
let getMinTempObj = (arr)=>{
    let min = Infinity, key;  
    arr.forEach((v, k) => { 
        if (min > +v.main.temp_min) { 
            min = +v.main.temp_min; 
            key = k; 
        }
    });
    return arr[key];
}

//getting raining cities for csv
let getRainCities = (arr)=>{
    arr = arr.filter(r=>_.has(r, "rain"));
    if(arr && arr.length > 0){
        arr = arr.map(item => item.city);
        arr = _.uniqBy(arr,(s) => s);
    }
    return arr;
}



