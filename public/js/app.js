
const form1 = document.getElementById("form1");
let input = document.getElementById("address");
let updatecontainer = document.getElementById("WeatherUpdates");

// console.log(form1);

form1.addEventListener("submit",(event)=>{
    event.preventDefault();
    let place = input.value;
    // console.log(place);
    if(place.length ===0){
        createErrorElement("Please, Enter some address!");
        return;
    }
    getWeather(place);
});

function createErrorElement(error){
    updatecontainer.innerHTML = "";
    let element = document.createElement('div');
    element.classList.add('error');
    element.innerText = error;
    updatecontainer.appendChild(element);
    input.value= "";
}

function createWPElement(data){
    updatecontainer.innerHTML = "";
    // console.log(data);
    let element = document.createElement('div');
    element.classList.add('flash');
    element.innerText = `Weather updates in ${data.location} is temperature close to ${data.temperature} and its ${data['weather_descriptions'][0]}. Chances of rain are ${parseFloat(data.rain_per)*10}%`;
    updatecontainer.appendChild(element);
    input.value="";
}

function getWeather(place){
    fetch(`/weather?address=${place}`)
    .then(response=>{
        return response.json();
    }).then(data=>{
        if(data.error){
            // console.log(data.error);
            createErrorElement("Please try to Search for some different location!");
            return;
        }
        createWPElement(data);
    })
}
