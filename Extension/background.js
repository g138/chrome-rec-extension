var contentTabId;
let recorder = null;
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message) {
	console.log(message);
	if (message.from === 'con-stop') {
		var url = message.audioBlob;
		chrome.downloads.download(
			{
				url: url,
				filename: 'filename.webm',
			},
			() => {}
		);
	}
	if (message.from === 'stop') {
		recorder.stop();
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			console.log(tabs);
			chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' });
		});
	}
	if (message.from === 'start') {
		chrome.desktopCapture.chooseDesktopMedia(['tab'], function (id) {
			navigator.webkitGetUserMedia(
				{
					audio: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: id,
							echoCancellation: true,
						},
					},
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: id,
						},
					},
				},
				gotStream,
				(error) => {
					console.log(error);
				}
			);
		});
	}
}

function gotStream(stream) {
	var chunks = [];
	recorder = new MediaRecorder(stream, {
		videoBitsPerSecond: 2500000,
		ignoreMutedMedia: true,
		mimeType: 'video/webm',
	});
	recorder.ondataavailable = function (event) {
		if (event.data.size > 0) {
			chunks.push(event.data);
		}
	};

	recorder.onstop = function () {
		var superBuffer = new Blob(chunks, {
			type: 'video/webm',
		});

		var url = URL.createObjectURL(superBuffer);
		chrome.downloads.download(
			{
				url: url,
				filename: 'filename.webm',
			},
			() => {}
		);
	};
	recorder.start();
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { action: 'start' });
	});
}

chrome.downloads.onChanged.addListener(function (e) {
	console.log(e);
});
