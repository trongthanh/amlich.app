import { LitElement, css, html } from 'lit';
import '@github/file-attachment-element';

export const ELEMENT_NAME = 'wallpaper-display';

export class WallpaperDisplay extends LitElement {
	static properties = {
		_imageLoaded: { state: true },
	};
	// Define scoped styles right with your component, in plain CSS
	static styles = css`
		:host {
			position: relative;
			display: block;
			overflow: hidden;
			width: 100%;
			min-height: 100%;
		}
		.wrapper {
			min-height: 600px;
		}
		file-attachment {
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2px dashed var(--sl-color-gray-600);
			position: absolute;
			top: 25%;
			left: 5%;
			right: 5%;
			height: 50%;
			min-height: 300px;
		}

		file-attachment[hover] {
			border-color: var(--sl-color-purple-500);
		}

		.loaded file-attachment {
			display: none;
		}

		file-attachment > label {
			display: block;
		}
		.image {
			display: block;
			width: 100%;
		}
		.image-container {
			max-width: 100%;
		}
	`;

	constructor() {
		super();
		// Declare reactive properties
		this.imageLoaded = false;
	}

	get _imageDisplay() {
		return this.renderRoot.querySelector('#imageDisplay');
	}

	_imageFileSelected(event) {
		const imageDisplay = this._imageDisplay;
		const { attachments } = event.detail;
		const file = attachments[0].file;
		// pre.textContent = attachments.map((a) => a.file.name).join('\n');

		var reader = new FileReader();
		reader.onload = (e) => {
			imageDisplay.src = e.target.result;
			this.imageLoaded = true;
		};
		reader.readAsDataURL(file);
	}

	// Render the UI as a function of component state
	render() {
		return html`
			<div class="wrapper ${this.imageLoaded ? 'loaded' : ''}" @file-attachment-accepted=${this._imageFileSelected}>
				<file-attachment id="imagePicker">
					<label>Drop image here or <input type="file" accept="image/*" ></input></label>
				</file-attachment>

				<div class="image-container">
					<img id="imageDisplay" class="image" />
				</div>
			</div>
		`;
	}
}
customElements.define(ELEMENT_NAME, WallpaperDisplay);
