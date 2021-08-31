var recorder = null;
var context;
chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message, sender, respond) {
	console.log(message);
	if (message.action === 'stop') {
		recorder.stop();
	}
	if (message.action === 'start') {
		navigator.mediaDevices
			.getUserMedia({
				audio: { echoCancellation: true },
			})
			.then((e) => {
				var chunks = [];

				console.log(e);
				var options = {
					mimeType: 'audio/webm',
				};
				var audioChunks;
				recorder = new MediaRecorder(e, options);
				recorder.ondataavailable = function (event) {
					if (event.data.size > 0) {
						chunks.push(event.data);
					}
				};
				recorder.onstop = function () {
					var superBuffer = new Blob(chunks, {
						type: 'audio/webm',
					});

					var url = URL.createObjectURL(superBuffer);
					chrome.runtime.sendMessage({ from: 'con-stop', audioBlob: url });
				};
				recorder.start();
			})
			.catch((e) => {
				console.log(e);
			});
	}
}
