import { sortDataByDate, formatDate, emitMessage } from "../utils";
import { apiConfig } from "../../config/apiConfig";

class IndexRecordModel {
  constructor() {
    this.recordsStorage = apiConfig.storage.allRecords;
    this.lastRecordStorage = apiConfig.storage.lastRecord;
    this.updateRecordsStorage = apiConfig.storage.updateRecords;

    this.indexFields = ["elec_night", "water", "gaz", "elec_day"];
    this.integerFields = {"residents_home": 3, "residents_wash": "0", "homeworkers": 1};

    const [date, time] = formatDate(new Date()).split(' ');
    this.date = date;
    this.todayDate = date + 'T' + time;

    this.record = {
      "gaz_heat_on":false,
      "elec_night":0,
      "wood_heat_on":false,
      "residents_wash":0,
      "wood_bag_open":false,
      "date":0,
      "water":0,
      "homeworkers":0,
      "temperature":0,
      "gaz":0,
      "elec_day":0,
      "homeworking":true,
      "user_id":"",
      "residents_home":0
    }
  }

  saveRecord(e) {
    // console.log("saveRecord", e); return;
    sessionStorage.setItem(this.updateRecordsStorage, true);

    const token = e.target.token;
    const apiRoute = e.target.apiRoute;

    const indexesForm = document.querySelector('#indexesForm');
    const indexesInputs = indexesForm.querySelectorAll('input');
    const insertDataButton = document.querySelector('#insertDataButton');
    
    let dataToPush = {};
    indexesInputs.forEach(input => {
        let [inputName, inputValue] = 
            input.type == "checkbox" ? [input.name, input.checked] : [input.name, input.value];
        inputValue = inputName == "date" ? new Date(input.value).valueOf() : inputValue;
        dataToPush[inputName] = inputValue;
    });

    if(sessionStorage.getItem('user_id') == null){
        emitMessage("Unauthorized User", "#c78438");
        return;
    }

    insertDataButton.style.background = '#666666';
    insertDataButton.innerHTML = 'Saving data...';

    const userId = sessionStorage.getItem('user_id');
    dataToPush['user_id'] = userId;

    const data = JSON.stringify(dataToPush);
    const recordId = (dataToPush.hasOwnProperty('id') && dataToPush.id != "") ? dataToPush.id : false;
    // console.log(data, token, apiRoute, recordId, e);
    // console.log(`User ${token} try to add data from ${apiRoute}`);
    // return;
    if(!recordId) {
        return e.target.addRecord(data, token, apiRoute);
    }else{
        return e.target.editRecord(data, token, apiRoute, recordId);
    }
  }

  addRecord(data, token, apiRoute) {    
      //console.log(`User ${token} try to add data from ${apiRoute}`);
      fetch(apiRoute, {
          method: 'POST',
          headers: {
              'authorization': token,
              'Content-Type': "application/json"
          },
          body: data,
      })
      .then(response => response.json())
      .then(data => {
          //console.log("Record added", data);
          document.querySelector('#add-record').classList.remove('open');
          emitMessage(`Record ${data.id} added`, "#2fb84e");
      })
      .catch(e => {
          //console.log({"status": e.status, "message": e.message});
          emitMessage(e.message, "#ec1c1c");
      });
  }

  editRecord(data, token, apiRoute, recordId) {
      let apiRouteWithRecordId = apiRoute + `/${recordId}`;
      //console.log(`User ${token} try to edit data from ${apiRouteWithRecordId}`);
      fetch(apiRouteWithRecordId, {
          method: 'PATCH',
          headers: {
              'authorization': token,
              'Content-Type': "application/json"
          },
          body: data,
      })
      .then(response => response.json())
      .then(data => {
          //console.log("Record edited", data);
          document.querySelector('#add-record').classList.remove('open');
          emitMessage(`Record ${data.id} edited`, "#2fb84e");
      })
      .catch(e => {
          //console.log({"status": e.status, "message": e.message});
          emitMessage(e.message, "#ec1c1c");
      });;
  }

  /**
   * This function return record from records collection locally stored.
   * In case that record does not exist, it returns last known record.
   * 
   * @param {*} id 
   */
  getIndexRecord(recordId=undefined,draft=false) {
    // console.log("try to fetch record with id ",recordId);
    // No avalaible data
    if(!sessionStorage.getItem(this.recordsStorage)){
      return undefined;
    }
    // No recordId and no draft wanted
    if(recordId == undefined && !draft){
      return undefined;
    }
    // Draft wanted
    if(recordId == undefined && draft){
      return this.setRecordDraft();
    }

    let records = JSON.parse(sessionStorage.getItem(this.recordsStorage));
    let results = records.filter(record => {
      return record.id == recordId;
    });

    if(results.length == 0){
        return this.record();
    }else if(results.length == 1){
        return results[0];
    }else{
      return sortDataByDate(results, "desc")[0];
    }
  }

  setRecordDraft() {
    var recordDraft = undefined;
    // Using last values to set in the form
    if(sessionStorage.getItem(this.recordsStorage)){
      let records = JSON.parse(sessionStorage.getItem(this.recordsStorage));
      let dummyRecord = records[0];
      recordDraft = dummyRecord;

      for(let entry in dummyRecord){
        if(this.indexFields.includes(entry)){
          let values = this.getValues(records, entry);
          recordDraft[entry] = Math.max(...values);
        }else if(Object.keys(this.integerFields).includes(entry)){
          recordDraft[entry] = this.integerFields[entry];
        }else{
          recordDraft[entry] = "";
        }
      }
      recordDraft.id = undefined;
      recordDraft.date = new Date().valueOf();
    }
    // No avaliable records, try to fetch last record data from session
    if(recordDraft == undefined && sessionStorage.getItem(this.recordModel.lastRecordStorage)){
      recordDraft = JSON.parse(sessionStorage.getItem(this.recordModel.lastRecordStorage));
      recordDraft.id = undefined;
    }
    return recordDraft;
  }

  getValues(data, field, castToInt=true, bool=false) {
    let values = [];
    data.forEach(item => {
      if(item[field]){
        let value;
        if(castToInt){
          value = parseFloat(item[field]);
        }else if(bool){
          value = item[field] ? 1 : 0;
        }else{
          value = item[field];
        }
        values.push(value);
      }
    });
    // console.log("getValues: ", values);
    return values;
  }
}

export { IndexRecordModel };
