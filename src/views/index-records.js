import { GateKeeper } from '../gatekeeper.js';
import { auth } from '../../config/firebaseConfig.js';
import { emitMessage, delay } from '../utils.js';
import { IndexListController } from '../controllers/IndexListController.js';
import { IndexRecordController } from '../controllers/IndexRecordController.js';

/* Contain all authentication logic */
const authTools = new GateKeeper(auth);

/* Waiting for authentication */
const waitTime = 1500;
const noWaitTime = 10;
var timeToWait = waitTime;

if(sessionStorage.getItem('user_token')){
  timeToWait = noWaitTime;
}else{
  emitMessage("Connecting to service.", "#d61007");
}

delay(timeToWait).then(() => {
  let token = sessionStorage.getItem('user_token');
  /* Contain entry of indexes logic */
  const indexList = new IndexListController(token);
  /* Contain entry of indexes logic */
  const indexForm = new IndexRecordController(token);

  indexList
    .getRecords()
    .then(data => {
      let recordsCount = data.length
      let message = `${recordsCount} records fetched.`;
      emitMessage(message);
      return data;
    })
    .then(data => {
      indexList.render(data);
      indexForm.setEvents();
    })
    .catch(error => {
      emitMessage(error);
    });

});
