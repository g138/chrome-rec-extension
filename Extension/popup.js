// // let start = document.getElementById('start'), stop  = document.getElementById('stop'), mediaRecorder;
let btnStartTab = document.getElementById('start');
let btnStartTab1 = document.getElementById('stop');

btnStartTab.addEventListener('click', function (event) {
	chrome.runtime.sendMessage({ from: 'start' });
});

btnStartTab1.addEventListener('click', function (event) {
	chrome.runtime.sendMessage({ from: 'stop' });
});

// function StartTabRecording() {
//   console.log("hello");

//   chrome.runtime.sendMessage(
//     { prepareRecording: 'on', recVolume: 1 },
//     function (response) {}
//   );
//   window.close();
// }
