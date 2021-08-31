var contentTabId;
var shouldStop = false;
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message) {
	console.log(message);
	if (message.from === 'start') {
		chrome.desktopCapture.chooseDesktopMedia(['tab', 'audio'], null, function (streamId, options) {
			navigator.webkitGetUserMedia(
				{
					audio: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: streamId,
							echoCancellation: true,
						},
					},
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: streamId,
							maxWidth: window.screen.width,
							maxHeight: window.screen.height,
							maxFrameRate: 30,
						},
					},
				},
				function (e) {
					console.log(e);
					let recordedChunks = [];
					var mediaRecorder = new MediaRecorder(e);

					mediaRecorder.ondataavailable = function (e) {
						if (e.data.size > 0) {
							recordedChunks.push(e.data);
						}

						if (shouldStop === true) {
							mediaRecorder.stop();
							mediaRecorder.state = 'inactive';
						}
					};

					mediaRecorder.start(200);
				},
				function (e) {
					console.log(e);
				}
			);
		});
	} else if (message.from === 'stop') {
		shouldStop = true;
	}
}
