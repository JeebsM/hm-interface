// Extend the HTMLElement class to create the web component
class NavigationMenu extends HTMLElement {

	/**
	 * The class constructor object
	 */
	constructor () {

		// Always call super first in constructor
		super();

		// Render HTML
		this.innerHTML = /* html */ `
        <nav class="row">
        <div class="column">
          <a class="startpage" href="/index.html"><i class="material-icons icon">home</i>Home</a>
          <a href="/indexes.html"><i class="material-icons icon">format_list_bulleted</i>Records</a>
          <a href="/summary.html"><i class="material-icons icon">summarize</i>Summary</a>
					<a class="sign-out"><i class="material-icons sign-out icon">logout</i>Out</a>
        </div>
      </nav>
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
	customElements.define('navigation-menu', NavigationMenu);
}