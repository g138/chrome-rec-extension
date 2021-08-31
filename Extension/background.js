var contentTabId;
let recorder = null;
chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message) {
	console.log(message);
	if (message.from === 'stop') {
		recorder.stop();
	}
	if (message.from === 'start') {
		chrome.desktopCapture.chooseDesktopMedia(['tab', 'audio'], function (id) {
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
		console.log(url);
	};
	recorder.start();
}

chrome.downloads.onChanged.addListener(function (e) {
	console.log(e);
});
