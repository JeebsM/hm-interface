import { IndexSummaryModel } from '../models/IndexSummaryModel.js';

class IndexSummaryController {

    constructor() {
        this.summaryProcessor = new IndexSummaryModel();
    }

    getSummary(records, range) {
      return this.summaryProcessor.getSummary(records, range);
    }

    getMonthSummary(records, month, year) {
        return this.summaryProcessor.getMonthSummary(records, month, year);
    }

    render(summary, placeholder, period) {
        //console.log(summary);
        let periodString = period ? `Report for ${period} (${summary.entry})` : `Report on ${summary.entry} entries`;
        placeholder.innerHTML = `
            <h4>${periodString} (avg ${summary.home.temperature} °C)</h4>
            <dl>
                <dt>HOME: ${summary.home.residents} residents</dt>
                <dd>
                    <p>${summary.home.wash} showers taken</p>
                    <p>Homeworking: ${summary.home.working_day} days</p>
                    <p>Homeworkers: ${summary.home.workers} persons</p>
                </dd>
            </dl>
            <dl>
                <dt>GAZ: ${summary.gaz.total} kwh</dt>
                <dd>
                    <p>Hot water: ${summary.gaz.water} kwh</p>
                    <p>Heating: ${summary.gaz.heat_on} days</p>
                    <p>Heat: ${summary.gaz.heat} kwh</p>
                    <p>Per heat day: ${summary.gaz.per_heat_on} kwh</p>
                    <p>Total per day: ${summary.gaz.per_day} kwh</p>
                </dd>
            </dl>
            <dl>
                <dt>ELECTRICITY: ${summary.electricity.total} kwh</dt>
                <dd>
                    <p>Day: ${summary.electricity.day} kwh</p>
                    <p>Night: ${summary.electricity.night} kwh</p>
                    <p>Homework: ${summary.electricity.per_working_day} kwh/day</p>
                </dd>
            </dl>
            <dl>
                <dt>WATER: ${summary.water.total} l</dt>
                <dd>
                    <p>Total/day: ${summary.water.per_day} l</p>
                    <p>Consumption: ${summary.water.other} l</p>
                    <p>Wash: ${summary.water.wash} l</p>
                    <p>Shower: ${summary.water.per_wash} l per wash</p>
                </dd>
            </dl>
            <dl>
                <dt>WOOD: ${summary.wood.total} kg</dt>
                <dd>
                    <p>${summary.wood.heat_on} fires</p>
                    <p>${summary.wood.per_heat_on} kg</p>
                </dd>
            </dl>
        `;
    }

}

export { IndexSummaryController };