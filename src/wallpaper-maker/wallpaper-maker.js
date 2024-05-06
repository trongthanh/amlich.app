const sidebar = document.querySelector('#sidebar');
const closeButton = sidebar.querySelector('sl-button[variant="primary"]');
document.querySelector('#myButton').addEventListener('click', () => {
	sidebar.show();
});

closeButton.addEventListener('click', () => sidebar.hide());
