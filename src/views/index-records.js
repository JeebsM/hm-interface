import { GateKeeper } from '../gatekeeper.js';
import { auth } from '../../config/firebaseConfig.js';
import { emitMessage } from '../utils.js';
import { IndexListController } from '../controllers/IndexListController.js';
import { IndexRecordController } from '../controllers/IndexRecordController.js';

/* Contain all authentication logic */
const authTools = new GateKeeper(auth);

if(sessionStorage.getItem('user_token')){
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
      indexList.render(data);
      indexForm.setEvents();
    })
    .catch(error => {
      emitMessage(error);
    });

}else{
  emitMessage("You are not connected!"," #d61007");
}
