// Extend the HTMLElement class to create the web component
class IndexRecordForm extends HTMLElement {

	/**
	 * The class constructor object
	 */
	constructor () {

		// Always call super first in constructor
		super();

		// Render HTML
		this.innerHTML = /* html */ `
			<div id="add-record" class="modal-background">
				<div class="modal active">
					<h2><span id="actionTitlePlaceholder">Add</span> indexes for <span id="todayDatePlaceholder">{today}</span></h2>
					<form id="indexesForm" class="index-grid" action="">
						<div class="form-group hidden">
							<label for="id">Id</label>
							<input type="text" name="id" id="id" value="" disabled>
						</div>
						<div class="form-group">
							<label for="date">Date</label>
							<input type="datetime-local" name="date" id="dateInput">
						</div>
						<div class="form-group">
							<label for="temperature">Temperature</label>
							<input type="number" name="temperature" id="" step=".1" value="17.0">
						</div>
						<div class="form-group">
							<label for="elec_day">Electricity day</label>
							<input type="number" name="elec_day" id="" value="48848" min="48848">
						</div>
						<div class="form-group">
							<label for="elec_night">Electricity nigh</label>
							<input type="number" name="elec_night" id="" value="28742" min="28742">
						</div>
						<div class="form-group">
							<label for="gaz">Gaz</label>
							<input type="number" name="gaz" id="" value="10490" min="10490">
						</div>
						<div class="form-group">
							<label for="water">Water</label>
							<input type="number" name="water" id="" value="361000" min="361000">
						</div>
						<div class="form-group">
							<label for="residents_home">Residents</label>
							<input type="number" name="residents_home" id="" value="3" min="0">
						</div>
						<div class="form-group">
							<label for="residents_wash">Showers</label>
							<input type="number" name="residents_wash" id="" value="0" min="0">
						</div>
						<div class="form-group">
							<label for="homeworkers">Homeworkers</label>
							<input type="number" name="homeworkers" id="homeworkersInput" value="1" min="0">
						</div>
						<div class="form-group hidden">
							<label for="homeworking">Homeworking</label>
							<input type="checkbox" name="homeworking" id="homeworkingInput" checked>
						</div>
						<div class="form-group">
							<label for="gaz_heat_on">Gaz heat on?</label>
							<input type="checkbox" name="gaz_heat_on" id="">
						</div>
						<div class="form-group">
							<label for="wood_heat_on">Wood heat on?</label>
							<input type="checkbox" name="wood_heat_on" id="">
						</div>
						<div class="form-group">
							<label for="wood_bag_open">Wood bag open?</label>
							<input type="checkbox" name="wood_bag_open" id="">
						</div>
					</form>
					<button id="insertDataButton" style="width:100%">Save</button>
				</div>
			</div>
    `;
	}

	/**
	 * Runs each time the element is appended to or moved in the DOM
	 */
	connectedCallback () {
		//console.log('connected!', this);
	}

	/**
	 * Runs when the element is removed from the DOM
	 */
	disconnectedCallback () {
		//console.log('disconnected', this);
	}

}

// Define the new web component
if ('customElements' in window) {
	customElements.define('index-record-form', IndexRecordForm);
}