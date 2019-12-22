import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
const axios = require('axios');
const DarkSkyApi = require('dark-sky-api');


class App extends Component {

    constructor() {
        super()
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const Google_Map_KEY = "AIzaSyAAY4qMHLumLEdFwtDDSfTM4EgLnV1xe7Y";
        DarkSkyApi.apiKey = "550f6d8a47647ed1a014a686b6958ccf";
        const responseUnits = DarkSkyApi.getResponseUnits();
        var location = this.state.value;
        var n = new Date();
        var y = n.getFullYear();
        var m = n.getMonth()+1;
        var d = n.getDate();

        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params:{
            address:location,
            key: 'AIzaSyAAY4qMHLumLEdFwtDDSfTM4EgLnV1xe7Y'
          }
        }).then(function(response){
          //log full response
          console.log(response);
          var lat = response.data.results[0].geometry.location.lat;
          var lng = response.data.results[0].geometry.location.lng;
          var position = {
            latitude: lat,
            longitude: lng
          };
          DarkSkyApi.loadCurrent(position).then(result => console.log(result));
          DarkSkyApi.loadCurrent(position)
          .then((data) => {

            var formattedWeatherOutput = `
              <p3><strong>Today's weather(${m}/${d}/${y}):</strong> ${data.summary}</p3>

              <p3>Today's temperature is ${data.temperature} degrees ${responseUnits.temperature}</p3><br>
              <p3>The wind speed is ${data.windSpeed} ${responseUnits.windSpeed}</p3>
            `;

            document.getElementById('formatted-weather-current').innerHTML = formattedWeatherOutput;
          });
          DarkSkyApi.loadForecast(position).then(result => console.log(result));
          DarkSkyApi.loadForecast(position)
          .then((data) => {
            var formattedForecastOutput = '<ul class="list-group"><a><strong>Next Week Forecast</strong></a>';
            var i = 0;
            for (i = 0; i < 7; i++) {
              console.log(i)
              formattedForecastOutput += `
              <li class="list-group-item"><strong>${m}/${d+i+1}/${y}:</strong>${data.daily.data[i].summary} Temperature is from ${data.daily.data[i].temperatureLow} to ${data.daily.data[i].temperatureHigh} degrees ${responseUnits.temperature}</li>
              `;


            }
            formattedForecastOutput += '</ul>';
            document.getElementById('formatted-weather-future').innerHTML = formattedForecastOutput;
          });

        }).catch(function(error){
          console.log(error);
        })


    }


    render() {
        return (
          <div className="App">
            <form className="search-form" onSubmit={this.handleSubmit}>
              <input className="search-input" type="text" value={this.state.value} onChange={this.handleChange} />
              <button className="search-button" type="submit">Search</button>
            </form>
              <div class="card-block" id="formatted-weather-current"></div>
              <div class="card-block" id="formatted-weather-future"></div>
          </div>
        )
    }
}
export default App;
