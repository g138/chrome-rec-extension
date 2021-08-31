let btnStartTab = document.getElementById('start');
let btnStartTab1 = document.getElementById('stop');

btnStartTab.addEventListener('click', function (event) {
	chrome.runtime.sendMessage({ from: 'start' });
});

btnStartTab1.addEventListener('click', function (event) {
	chrome.runtime.sendMessage({ from: 'stop' });
});
