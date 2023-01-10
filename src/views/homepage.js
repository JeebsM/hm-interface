import { GateKeeper } from '../gatekeeper.js';
import { auth } from '../../config/firebaseConfig.js';
import { emitMessage, formatDate, delay } from '../utils.js';
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

  indexList
    .getLastRecord()
    .then(data => {
      let message = "Last record from " + formatDate(new Date(data.date));
      emitMessage(message);
    })
    .catch(error => {
      emitMessage(error, "#d61007");
    });
  
  /* Contain entry of indexes logic */
  const indexForm = new IndexRecordController(token);
  indexForm.setEvents();
});
