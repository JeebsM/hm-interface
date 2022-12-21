import { IndexRecordItem } from '../components/index-record-item.js';
import { IndexListModel } from '../models/IndexListModel.js';
import { WeatherTemperatureModel } from '../models/WeatherTemperatureModel.js';
import { formatDate } from '../utils.js';

class IndexListController {

  constructor(token) {
    this.indexListModel = new IndexListModel(token);
    this.indexListModel.toggleUpdateRecordsStorage();
    this.indexListModel.fetchDataFromApi();

    this.weatherWebservice = new WeatherTemperatureModel();
  }

  getRecords() {
    return this.indexListModel.getAllRecords();
  }

  getLastRecord() {
    return this.indexListModel.getLastRecord();
  }

  getOutsideTemperatures() {
    return this.weatherWebservice.getOutsideTemperatures();
  }

  render(records) {
    let recordsSorted = this.indexListModel.sortRecordsByDate(records);
    let outsideTemperatures = this.weatherWebservice.getOutsideTemperatures();
    
    const recordsListZone = document.querySelector('#content');
    var recordsList = document.createElement("div");
        recordsList.classList.add('record');
    recordsSorted.forEach(log => {
      let date = formatDate(new Date(log.date),true);
      let indexLog = document.createElement('index-record-item');
          indexLog.setAttribute('date', date);
          indexLog.setAttribute('temperature', log.temperature);
          indexLog.setAttribute('min_out_temperature', outsideTemperatures?.[date]?.min);
          indexLog.setAttribute('max_out_temperature', outsideTemperatures?.[date]?.max);
          indexLog.setAttribute('id', log.id);
          indexLog.setAttribute('elec_day', log.elec_day);
          indexLog.setAttribute('elec_night', log.elec_night);
          indexLog.setAttribute('gaz', log.gaz);
          indexLog.setAttribute('water', log.water);
          indexLog.setAttribute('residents_home', log.residents_home);
          indexLog.setAttribute('homeworkers', log.homeworkers);
          indexLog.setAttribute('residents_wash', log.residents_wash);
          indexLog.setAttribute('wood_heat_on', log.wood_heat_on);
          indexLog.setAttribute('gaz_heat_on', log.gaz_heat_on);
          recordsList.append(indexLog);
    });
    recordsListZone.innerHTML = '';
    recordsListZone.appendChild(recordsList);
  }
  
}

export { IndexListController };