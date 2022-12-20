import { GateKeeper } from '../gatekeeper.js';
import { IndexSummaryController } from '../controllers/IndexSummaryController.js';
import { IndexListController } from '../controllers/IndexListController.js';
import { auth } from '../../config/firebaseConfig.js';
import { emitMessage } from '../utils.js';

/* Contain all authentication logic */
const authTools = new GateKeeper(auth);

if(sessionStorage.getItem('user_token')){

  let token = sessionStorage.getItem('user_token');
  /* Contain entry of indexes logic */
  const indexList = new IndexListController(token);

  /* Contain entry of indexes logic */
  const summaryController = new IndexSummaryController();

  indexList
    .getRecords()
    .then(data => {
      let recordsCount = data.length
      let message = `${recordsCount} records fetched. Processing and rendering statistical summary.`;
      emitMessage(message);
      let summaryPlaceholer = document.querySelector('#content');
          summaryPlaceholer.classList.add("statistics");
      let summary = summaryController.getSummary(data);
      summaryController.render(summary, summaryPlaceholer);
    })
    .catch(error => {
      emitMessage(error);
    });
  // summary.setEvents();
}else{
  // summary.unsetEvents();
}
