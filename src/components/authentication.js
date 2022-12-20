// Extend the HTMLElement class to create the web component
class AuthenticationModal extends HTMLElement {

	/**
	 * The class constructor object
	 */
	constructor () {

		// Always call super first in constructor
		super();

		// Render HTML
		this.innerHTML = /* html */ `
			<div class="auth">
				<div class="modal active">
					<h2>Login</h2>
					<form class="login">
						<input type="text" name="email" placeholder="Email">
						<input type="password" name="password" placeholder="Password">
						<button>Login</button>
						<p class="error"></p>
					</form>
					<div>No account? <a class="switch">Register instead</a></div>
				</div>
				<div class="modal">
					<h2>Register</h2>
					<form class="register">
						<input type="text" name="email" placeholder="Email">
						<input type="password" name="password" placeholder="Password">
						<input type="text" name="displayName" placeholder="Name">
						<button>Register</button>
						<p class="error"></p>
					</form>
					<div>Got an account? <a class="switch">Login instead</a></div>
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
	customElements.define('authentication-modal', AuthenticationModal);
}