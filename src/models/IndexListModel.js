import { apiConfig } from '../../config/apiConfig.js';

class IndexListModel {

  constructor(token) {

    this.token = token;
    this.apiRoute = apiConfig.apiRoute.records;

    this.recordsStorage = apiConfig.storage.allRecords;
    this.lastRecordStorage = apiConfig.storage.lastRecord;
    this.updateRecordsStorage = apiConfig.storage.updateRecords;
    this.outsideTemperaturesStorage = apiConfig.storage.outsideTemperatures;

  }

  getAllRecords() {
    if(sessionStorage.getItem(this.recordsStorage)){
      return this.fetchDataFromStorage(this.recordsStorage);
    }else{
      return this.fetchDataFromApi();
    }
  }

  getLastRecord() {
    if(sessionStorage.getItem(this.lastRecordStorage)){
      return this.fetchDataFromStorage(this.lastRecordStorage);
    }else if(sessionStorage.getItem(this.recordsStorage)){
      this.setLastRecord();
      return this.fetchDataFromStorage(this.lastRecordStorage);
    }else{
      throw new Error("No records in storage. Maybe something wrong with API call?");
    }
  }

  fetchDataFromStorage(dataObject) {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(sessionStorage.getItem(dataObject)));
    });
  }

  fetchDataFromApi() {
    // console.log(`API call to ${this.apiRoute} to fetch all records`);
    return fetch(this.apiRoute, {
        headers: {
            authorization: this.token
        }
    })
    .then(response => response.json())
    .then(data => {
      // console.log("fetching data", data);
      sessionStorage.setItem(this.recordsStorage, JSON.stringify(data));
      let lastRecord = this.sortRecordsByDate(data, "desc")[0];
      sessionStorage.setItem(this.lastRecordStorage, JSON.stringify(lastRecord));
      this.toggleUpdateRecordsStorage();
      return data;
    });
  }

  setLastRecord() {
    let records = JSON.parse(sessionStorage.getItem(this.recordsStorage));
    let lastRecord = this.sortRecordsByDate(records, "desc")[0];
    sessionStorage.setItem(this.lastRecordStorage, JSON.stringify(lastRecord));
  }

  sortRecordsByDate(data, type="desc") {
    if(type == "desc") {
        return data.sort((a, b) => (a.date > b.date) ? -1 : 1);
    }
    return data.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }

  toggleUpdateRecordsStorage() {
    if(sessionStorage.getItem(this.updateRecordsStorage)){
      let actualState = sessionStorage.getItem(this.updateRecordsStorage);
      sessionStorage.setItem(this.updateRecordsStorage, !actualState);
    }else{
      sessionStorage.setItem(this.updateRecordsStorage, true);
    }
  }

}

export { IndexListModel };