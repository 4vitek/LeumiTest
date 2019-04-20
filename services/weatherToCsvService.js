////////////////////////////////////////////////
//Service for writing data to csv file        //
////////////////////////////////////////////////
const fs = require('fs');
const path = require('path');
const moment  = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvFolder = path.join(__dirname, `../csv`);  

const csvWriter = createCsvWriter({  
  path: `${csvFolder}/${'report'}.csv`,
  header: [
    {id: 'day', title: 'DAY'},
    {id: 'maxCityTempr', title: 'city with highest temp'},
    {id: 'minCityTempr', title: 'city with lowest temp'},
    {id: 'citiesRain',   title: 'cities with rain'},
  ]
});

//saving csv file with appropriate data
module.exports.saveCsv = async (accamlatedArr) =>{
    deleteFile();
    return new Promise((resolve,reject) => {
        csvWriter  
        .writeRecords(accamlatedArr)
        .then(()=> {
            console.log(`The CSV file was written successfully to ${csvFolder}`);
            resolve({"msg":"ok"});
        },(err)=>{
            console.log(err);
            reject(err);
        });  
    });
};

let deleteFile = () => {
    let report = `${csvFolder}/${'report'}.csv`;
    if (fs.existsSync(report)){
        fs.unlink(report, (error) => {
            if (error) {
                throw error;
            }
            console.log('report deleted');
        });
    }
}