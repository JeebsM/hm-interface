import { apiConfig } from "../../config/apiConfig";
import { formatDate } from "../utils";

class WeatherTemperatureModel {

  constructor() {

    this.todayDate = formatDate(new Date()).split(' ')[0];

    const apiRouteRoot = apiConfig.apiRoute.temperatures;
    var apiRouteParameters = `latitude=50.66&longitude=5.52&start_date=2022-07-11&end_date=${this.todayDate}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    this.apiRoute = apiRouteRoot + apiRouteParameters;
    this.outsideTemperaturesPermanent = apiConfig.permanent.outsideTemperatures;
    this.outsideTemperaturesStorage = apiConfig.storage.temperaturesRecords;

    this.fetchWeatherData()
      .then(data => {
        localStorage.setItem(this.outsideTemperaturesPermanent, JSON.stringify(data));
        return this.aggregateWeatherData(data?.daily);
      })
      .then(aggregation => {
        sessionStorage.setItem(this.outsideTemperaturesStorage, JSON.stringify(aggregation));
      });

  }

  getOutsideTemperatures() {
    if(sessionStorage.getItem(this.outsideTemperaturesStorage)){
      return JSON.parse(sessionStorage.getItem(this.outsideTemperaturesStorage));
    }

    return null;
  }

  fetchWeatherData() {
    // If data is already stored, we fetch it from storage
    if(localStorage.getItem(this.outsideTemperaturesPermanent)){
      let temperatureRecords = JSON.parse(localStorage.getItem(this.outsideTemperaturesPermanent));
      let recordsDates = temperatureRecords.daily.time;
      let lastRecord = recordsDates[recordsDates.length-1];
      
      if(lastRecord == this.todayDate){
        return new Promise((resolve, reject) => {
          resolve(JSON.parse(localStorage.getItem(this.outsideTemperaturesPermanent)));
        });
      }
    }
    // If data is not stored locally, we fetch it from Weather WS
    var myHeaders = new Headers();
    var myInit = {  method: 'GET',
                    headers: myHeaders,
                    mode: 'cors',
                    cache: 'default' };

    return fetch(this.apiRoute, myInit)
            .then(response => response.json());
  }

  aggregateWeatherData(data) {
    let timeseries = data.time;
    let minTemp = data.temperature_2m_min;
    let maxTemp = data.temperature_2m_max;
    var result = {};

    for(let i=0; i<=timeseries.length; i++){
      result[timeseries[i]] = {"min": minTemp[i], "max": maxTemp[i]};
    }
    
    return result;
  }

}

export { WeatherTemperatureModel };