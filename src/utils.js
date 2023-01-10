/* Helper functions */
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date, dateWithoutHour=false) {
    if(dateWithoutHour){
        return [
                date.getFullYear(),
                padTo2Digits(date.getMonth() + 1),
                padTo2Digits(date.getDate()),
            ].join('-')
    }
    return (
        [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),  // 👈️ can also add seconds
        ].join(':')
    );
}

function emitMessage(message, level="#2fb84e",timeout=10000) {
    const comZone = document.querySelectorAll('.comZone');
    comZone.forEach((zone) => {
        zone.style.color = level;
        zone.textContent = message;
        zone.classList.remove("hidden");
        setTimeout(() => {
            zone.classList.add("hidden");
        }, timeout);
    })
}

/**
 * This function return record from records collection locally stored.
 * In case that record does not exist, it returns last known record.
 * 
 * @param {*} id 
 */
function getRecordWithId(recordId) {
    //console.log("try to fetch record with id ",recordId);
    if(!sessionStorage.getItem('indexes-records')){
        return undefined;
    }
    let records = JSON.parse(sessionStorage.getItem('indexes-records'));
    let results = records.filter(record => {
        return record.id == recordId;
    });

    if(results.length == 0){
        return undefined;
    }else if(results.length == 1){
        return results[0];
    }else{
        return sortDataByDate(records, "desc")[0];
    }
}

function sortDataByDate(data, type="desc") {
    if(type == "desc") {
        return data.sort((a, b) => (a.date > b.date) ? -1 : 1);
    }
    return data.sort((a, b) => (a.date > b.date) ? 1 : -1);
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export {padTo2Digits, formatDate, emitMessage, getRecordWithId, sortDataByDate, delay}