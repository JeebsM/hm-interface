import { formatDate, emitMessage, sortDataByDate } from '../utils.js';

class IndexSummaryModel {
    constructor() {
        this.summary = {
            "entry": 0,
            "day": 0,
            "home": {
                "residents": 0,
                "wash": 0,
                "workers": 0,
                "working_day": 0,
                "temperature": 0,
            },
            "gaz": {
                "total": 0,
                "heat": 0,
                "water": 0,
                "heat_on": 0,
                "per_day": 0,
                "per_heat_on": 0,
            },
            "electricity": {
                "total": 0,
                "day": 0,
                "night": 0,
                "per_day": 0,
                "per_working_day": 0,
            },
            "water": {
                "total": 0,
                "wash": 0,
                "other": 0,
                "per_day": 0,
                "per_wash": 0,
            },
            "wood": {
                "total": 0,
                "bag": 0,
                "heat_on": 0,
                "per_heat_on": 0,
            }
        }
    }

    getSummary(data, range="all") {
        /* Data preparation */
        this.data = data ? sortDataByDate(data) : [];
        this.data = this.addDateStringToRecords();
        this.data = this.consolidateDataByDay();
        // console.log("before sort and filter", this.data);
        if(range != "all"){
            this.data = sortDataByDate(data,'desc').slice(0,parseInt(range));
        }
        // console.log("after sort and filter", this.data);
        return this.computeSummary();
    }

    getMonthSummary(data, month="01", year) {
        /* Data preparation */
        this.data = data ? sortDataByDate(data) : [];
        this.data = this.addDateStringToRecords();
        this.data = this.consolidateDataByDay();
        // console.log("before sort and filter", this.data);
        this.data = this.data.filter(record => parseInt(record.dateString.split("-")[1]) === parseInt(month) && parseInt(record.dateString.split("-")[0]) === parseInt(year));
        // console.log("after sort and filter", this.data);
        return this.computeSummary();
    }

    computeSummary() {
        const dates = this.getValues('date',false,false);
        const temperatures = this.getValues('temperature');
        const homeworkers = this.getValues('homeworkers');
        const residents_home = this.getValues('residents_home');
        const residents_wash = this.getValues('residents_wash');
        const homeworking = this.getValues('homeworking',false,true);
        const water = this.getValues('water');
        const elec_day = this.getValues('elec_day');
        const elec_night = this.getValues('elec_night');
        const gaz = this.getValues('gaz');
        const wood_bag_open = this.getValues('wood_bag_open',false,true);
        const gaz_heat_on = this.getValues('gaz_heat_on',false,true);
        const wood_heat_on = this.getValues('wood_heat_on',false,true);

        this.summary = {
            "entry": this.count(dates, true),
            "day": 0,
            "home": {
                "residents": this.sum(residents_home),
                "wash": this.sum(residents_wash),
                "workers": this.sum(homeworkers),
                "working_day": this.sum(homeworking),
                "temperature": this.average(temperatures),
            },
            "gaz": {
                "total": ((Math.max(...gaz) - Math.min(...gaz)) * 11.2206).toFixed(2),
                "heat": 0,
                "water": 0,
                "heat_on": this.sum(gaz_heat_on),
                "per_day": 0,
                "per_heat_on": 0,
            },
            "electricity": {
                "total": 0,
                "day": (Math.max(...elec_day) - Math.min(...elec_day)),
                "night": (Math.max(...elec_night) - Math.min(...elec_night)),
                "per_day": 0,
                "per_working_day": 0,
            },
            "water": {
                "total": (Math.max(...water) - Math.min(...water)),
                "wash": 0,
                "other": 0,
                "per_day": 0,
                "per_wash": 0,
            },
            "wood": {
                "total": 0,
                "bag": this.sum(wood_bag_open),
                "heat_on": this.sum(wood_heat_on),
                "per_heat_on": 0,
            }
        }
        // Computations
        this.summary.gaz.water = (this.summary.home.wash * 1.12206).toFixed(2);
        this.summary.gaz.heat = (this.summary.gaz.total - this.summary.gaz.water).toFixed(2);
        this.summary.gaz.per_day = (this.summary.gaz.total / this.summary.entry).toFixed(2);
        this.summary.gaz.per_heat_on = (this.summary.gaz.heat / this.summary.gaz.heat_on).toFixed(2);

        this.summary.electricity.total = (this.summary.electricity.day + this.summary.electricity.night);
        this.summary.electricity.per_day = (this.summary.electricity.total / this.summary.entry).toFixed(2);
        this.summary.electricity.per_working_day = (this.summary.electricity.day / this.summary.home.working_day).toFixed(2);

        this.summary.water.wash = (this.summary.water.total * 0.4).toFixed(2);
        this.summary.water.other = (this.summary.water.total * 0.6).toFixed(2);
        this.summary.water.per_day = (this.summary.water.total / this.summary.entry).toFixed(2);
        this.summary.water.per_wash = (this.summary.water.wash / this.summary.home.wash).toFixed(2);

        this.summary.wood.total = (this.summary.wood.bag * 15);
        this.summary.wood.per_heat_on = (this.summary.wood.total / this.summary.wood.heat_on).toFixed(2);
        //console.log(this.summary);
        return this.summary;
    }

    consolidateDataByDay() {
        let allDays = this.getValues('dateString', false);
        let days = allDays.filter((v, i, a) => a.indexOf(v) === i);
        let result = [];

        days.forEach(day => {
            let group = [];
            this.data.forEach(record => {
                if(record['dateString'] == day){
                    group.push(record);
                }
            });
            group.sort((a, b) => (a.date > b.date) ? -1 : 1);
            result.push(group[0]);
        });

        return result;
    }
    
    addDateStringToRecords() {
        return this.data.map(record => {
            record["dateString"] = formatDate(new Date(record.date)).split(' ')[0];
            return record;
        })
    }

    getValues(field, castToInt=true, bool=false) {
        let values = [];
        this.data.forEach(item => {
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
        return values;
    }

    sum(data, distinct=false) {
        if(distinct){
            let uniqueData = data.filter((v, i, a) => a.indexOf(v) === i);
            return uniqueData.reduce((partialSum, a) => partialSum + a, 0);
        }else{
            return data.reduce((partialSum, a) => partialSum + a, 0);
        }
    }

    count(data, distinct=false) {
        if(distinct){
            let uniqueData = data.filter((v, i, a) => a.indexOf(v) === i);
            return uniqueData.length;
        }else{
            return data.length;
        }
    }

    average(data, dividor=1) {
        const dataSum = this.sum(data);
        const dataCount = this.count(data);
        return (dataSum / dataCount).toFixed(2);
    }
}

export { IndexSummaryModel };