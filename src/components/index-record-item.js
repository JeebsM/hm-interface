// Extend the HTMLElement class to create the web component
class IndexRecordItem extends HTMLElement {

	/**
	 * The class constructor object
	 */
	constructor () {

		// Always call super first in constructor
		super();
	}

	/**
	 * Runs each time the element is appended to or moved in the DOM
	 */
	connectedCallback () {
        // Render HTML
		this.innerHTML = /* html */ `
				<details>
					<summary>
							<span class="record-title">Record from ${this.date}: ${this.temperature} °C</span>
							<a class="edit-record" recordId="${this.id}">Edit record</a>
					</summary>
					<p>
							<span><i class="material-icons">flash_on</i><i class="material-icons">sunny</i> ${this.elec_day}</span>
							<span><i class="material-icons">flash_on</i><i class="material-icons">brightness_2</i> ${this.elec_night}</span>
							<span><i class="material-icons">propane</i> ${this.gaz}</span>
							<span><i class="material-icons">water</i> ${this.water}</span>
					</p>
					<p>
							<span><i class="material-icons">group_add</i> ${this.residents_home}</span>
							<span><i class="material-icons">home_work</i> ${this.homeworkers}</span>
							<span><i class="material-icons">shower</i> ${this.residents_wash}</span>
					</p>
					<p>
							<span><i class="material-icons">local_fire_department</i> ${this.wood_heat_on}</span>
							<span><i class="material-icons">fireplace</i> ${this.gaz_heat_on}</span>
					</p>
				</details>
        `;
		//console.log('connected!', this);
	}

	/**
	 * Runs when the element is removed from the DOM
	 */
	disconnectedCallback () {
		//console.log('disconnected', this);
	}

	get date() {
        return this.getAttribute('date') || '';
    }

	get temperature() {
        return this.getAttribute('temperature') || '';
    }

	get id() {
			return this.getAttribute('id') ||'';
	}

	get elec_day() {
        return this.getAttribute('elec_day') || '';
    }

	get elec_night() {
        return this.getAttribute('elec_night') || '';
    }

	get gaz() {
		return this.getAttribute('gaz') ||'';
	}

	get water() {
		return this.getAttribute('water') ||'';
	}

	get residents_home() {
		return this.getAttribute('residents_home') ||'';
	}

	get homeworkers() {
		return this.getAttribute('homeworkers') ||'';
	}

	get residents_wash() {
		return this.getAttribute('residents_wash') ||'';
	}

	get wood_heat_on() {
		return this.getAttribute('wood_heat_on') ||'';
	}

	get gaz_heat_on() {
		return this.getAttribute('gaz_heat_on') ||'';
	}
}

// Define the new web component
if ('customElements' in window) {
	customElements.define('index-record-item', IndexRecordItem);
}