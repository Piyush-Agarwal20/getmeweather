import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

require('dotenv').config({
    path:path.join(__dirname,"../data/config.env")
})

const express = require('express');
const app = express();
const hbs = require('hbs');
const port = process.env.PORT||3000;
import { getGeoCode,getForecast } from '../src/utilis/weatherFunc.js';


// to setup the path
const publicDire = path.join(__dirname,'../public');
const ViewsPAth = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

// setting up views folder 
app.set("views",ViewsPAth);
hbs.registerPartials(partialsPath);

// serving static files on /static route
app.use("/static",express.static(publicDire));

// setting up handlebars(template engine) as default engine 
app.set('view engine','hbs');


app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Piyush Agarwal'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Piyush Agarwal'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Piyush Agarwal'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error:"please pass address in the qeury !"
        })
    }
    let place = req.query.address;
    getGeoCode(place,process.env.GEO_API_KEY,(error,data)=>{
        if(error){
            return res.send({
                error
            });
        }
        getForecast(data.latitude,data.longitude,process.env.WEATHER_API_KEY ,(error,WeatherData)=>{
            if(error){
                return res.send({
                   error
                })
            }
            // console.log(data.location);
            // console.log(WeatherData.current.temperature, WeatherData.current.weather_descriptions);
            res.send({
                location:data.location,
                temperature:WeatherData.current.temperature,
                weather_descriptions:WeatherData.current.weather_descriptions,
                time:WeatherData.current["observation_time"],
                rain_per:WeatherData.current.precip
            })
        });
    });
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})



app.listen(port,()=>{
    console.log('app is running on port : ',port);
})