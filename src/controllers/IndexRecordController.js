import { apiConfig } from '../../config/apiConfig.js'; 
import { formatDate } from '../utils';
import { IndexRecordModel } from '../models/IndexRecordModel.js';

class IndexRecordController {

  constructor(token) {
    this.apiRoute = apiConfig.apiRoute.records;
    this.token = token;
    this.insertRecordDataButton = document.querySelector('#insertDataButton');
    this.recordModel = new IndexRecordModel(token);

    this.actionTitlePlaceholder = document.querySelector('#actionTitlePlaceholder');

    // Toggle insert-record modals
    const modalAddRecord = document.querySelector('#add-record');
    document.querySelectorAll('.save-indexes').forEach(link => {
      link.addEventListener('click', () => {
        if(modalAddRecord.classList.contains('open')){
          modalAddRecord.classList.remove('open');
        }else{
          this.render();
          modalAddRecord.classList.add('open');
        }
      });
    });

    // close insert-record modal
    modalAddRecord.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-background')) {
        modalAddRecord.classList.remove('open');
      }
    });

    // Edit event
    document.addEventListener('click', e => {
      if (e.target.classList.contains('edit-record')) {
        modalAddRecord.classList.add('open');
        this.actionTitlePlaceholder.textContent = "Edit";
        this.render(e.target.attributes.recordId);
      }
    });
  }

  setEvents() {
    const dateInput = document.querySelector('#dateInput');
    const todayDatePlaceholder = document.querySelector('#todayDatePlaceholder');
    
    const homeworkersInput = document.querySelector('#homeworkersInput');
    const homeworkingInput = document.querySelector('#homeworkingInput');
    
    /* Programmatically set the date to today */
    dateInput.value = dateInput.max = this.recordModel.todayDate;
    todayDatePlaceholder.textContent = this.recordModel.date;

    /* Change title if date changes */
    dateInput.addEventListener('change', (e) => {
        todayDatePlaceholder.textContent = e.target.value;
        if(e.target.value == this.todayDate){
          this.actionTitlePlaceholder.textContent = "Add";
        }else{
          this.actionTitlePlaceholder.textContent = "Edit";
        }
    });

    /* If more than 1 resident homeworks, set homeworking input to true */
    homeworkersInput.addEventListener('change', (e) => {
        let homeworkers = parseInt(e.target.value);
        homeworkingInput.checked = homeworkingInput.value = homeworkers > 0;
    });

    /* Insert record */
    this.insertRecordDataButton.addEventListener('click', this.recordModel.saveRecord);
    this.insertRecordDataButton.token = this.token;
    this.insertRecordDataButton.apiRoute = this.apiRoute;
    this.insertRecordDataButton.addRecord = this.recordModel.addRecord;
    this.insertRecordDataButton.editRecord = this.recordModel.editRecord;
  }

  unsetEvents() {
    this.insertRecordDataButton.removeEventListener('click', this.recordModel.saveRecord);
  }

  render(e=undefined) {
    const indexesForm = document.querySelector('#indexesForm');
    const insertDataButton = document.querySelector('#insertDataButton');
    const indexesInputs = indexesForm.querySelectorAll('input');         

    insertDataButton.style.background = '#2fb84e';
    insertDataButton.innerHTML = 'Save';

    var recordDraft = undefined;
    // Try to fetch data based on recordId or get a dfrat with last values in it
    if(e !== undefined && e.value !== undefined){
      recordDraft = this.recordModel.getIndexRecord(e.value);
    }else{
      recordDraft = this.recordModel.getIndexRecord(undefined,true);
    }
    // No data at all, using default values set in the form
    if(recordDraft == undefined){
      return;
    }
    // console.log("recordDraft from controller: ", recordDraft);
    indexesInputs.forEach(input => {
      if(input.type == "datetime-local") {
        if(recordDraft[input.name] != undefined){
          let dateValue = formatDate(new Date(recordDraft[input.name])).split(' ').join("T");
          input.value = dateValue;
          return;
        }
      }
      if(input.type == "checkbox") {
        input.checked = recordDraft[input.name] ? recordDraft[input.name] : false;
      }else{
        input.value = "";
        if(recordDraft[input.name]){
          input.value = recordDraft[input.name];
        }
      }
    });
  }
}

export { IndexRecordController };