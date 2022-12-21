import { GateKeeper } from '../gatekeeper.js';
import { IndexSummaryController } from '../controllers/IndexSummaryController.js';
import { IndexListController } from '../controllers/IndexListController.js';
import { auth } from '../../config/firebaseConfig.js';
import { emitMessage } from '../utils.js';

/* Contain all authentication logic */
const authTools = new GateKeeper(auth);
const summaryPlaceholer = document.querySelector('#content_period');
const summaryMonthPlaceholer = document.querySelector('#content_month');
const fullDataFilterLink = document.querySelector('#all_query');

if(sessionStorage.getItem('user_token')){

  let token = sessionStorage.getItem('user_token');
  /* Contain entry of indexes logic */
  const indexList = new IndexListController(token);

  /* Contain entry of indexes logic */
  const summaryController = new IndexSummaryController();

  indexList
    .getRecords()
    .then(data => {
      let recordsCount = data.length;
      fullDataFilterLink.innerHTML = recordsCount;
      let message = `${recordsCount} records fetched. Processing and rendering statistical summary.`;
      emitMessage(message, undefined, 3000);
      let summary = summaryController.getSummary(data, recordsCount);
      summaryController.render(summary, summaryPlaceholer);
    })
    .catch(error => {
      emitMessage(error);
    });

  /* Events and dynamic text */
  document.querySelectorAll('.filter').forEach( filterLink => {
    filterLink.addEventListener('click', function(e){
      let summaryLength = e.target.attributes.value.value;
      indexList
        .getRecords()
        .then(data => {
          let summary = summaryController.getSummary(data, summaryLength);
          let period = null;
          summaryController.render(summary, summaryPlaceholer, period);
        })
        .catch(error => {
          emitMessage(error);
        });

    });
  });

  document.querySelectorAll('.filterMonth').forEach( filterLink => {
    filterLink.addEventListener('click', function(e){
      let month = e.target.attributes.value.value;
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth() + 1;
      let year = parseInt(month) > currentMonth ? currentYear - 1 : currentYear;
      indexList
        .getRecords()
        .then(data => {
          let summary = summaryController.getMonthSummary(data, month, year);
          let period = `${month}-${year}`;
          summaryController.render(summary, summaryMonthPlaceholer, period);
        })
        .catch(error => {
          emitMessage(error);
        });

    });
  });
  // summary.setEvents();
}else{
  // summary.unsetEvents();
}
