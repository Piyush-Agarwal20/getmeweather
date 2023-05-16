import { createRequire } from "module";
const require = createRequire(import.meta.url);

const request = require('request');
const getGeoCode = (place,key,callback)=>{
    const geoCode = key;
    const url = `http://api.positionstack.com/v1/forward?access_key=${geoCode}&query=${place}`;

    request({url,json:true},(error, response)=>{
        // console.log(response.body.data,error);
        if(error){
            callback("Could'nt connect to coordinate api service",undefined);
        }
        else if(response.body.error || response.body.data.length===0){
            callback("There was some error in request",undefined);
        }
        else{
            let {latitude,longitude,name} = response.body.data[0];
            callback(undefined,{
                latitude,
                longitude,
                location:name
            });
        }
    })
}


const getForecast = (latitude,longitude,key,callback)=>{
    const apiKey = key;
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${latitude},${longitude}`

    request({url,json:true},(error, response)=>{
        if(error){
            callback("Could'nt connect to weather api service",undefined);
        }
        else if(response.body.error){
            callback("There was some error in request 2",undefined);
        }
        else{
            // console.log(response.body);
            callback(undefined,response.body);
        }
    })
}


export {getGeoCode,getForecast};