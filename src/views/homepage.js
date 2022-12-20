import { GateKeeper } from '../gatekeeper.js';
import { auth } from '../../config/firebaseConfig.js';
import { emitMessage, formatDate } from '../utils.js';
import { IndexListController } from '../controllers/IndexListController.js';
import { IndexRecordController } from '../controllers/IndexRecordController.js';

/* Contain all authentication logic */
const authTools = new GateKeeper(auth);

if(sessionStorage.getItem('user_token')){
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

}else{
  emitMessage("You are not connected!", "#d61007");
}
