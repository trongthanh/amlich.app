const sidebar = document.querySelector('#sidebar');
const closeButton = sidebar.querySelector('sl-button[variant="primary"]');
document.querySelector('#drawerButton').addEventListener('click', () => {
	sidebar.show();
});

closeButton.addEventListener('click', () => sidebar.hide());

// const imagePicker = document.querySelector('#imagePicker');
// // const pre = imagePicker.querySelector('pre');
// const imageDisplay = document.querySelector('#imageDisplay');
// imagePicker.addEventListener('file-attachment-accepted', function (event) {
// 	const { attachments } = event.detail;
// 	const file = attachments[0].file;
// 	// pre.textContent = attachments.map((a) => a.file.name).join('\n');
//
// 	var reader = new FileReader();
// 	reader.onload = function (e) {
// 		imageDisplay.src = e.target.result;
// 	};
// 	reader.readAsDataURL(file);
// });
