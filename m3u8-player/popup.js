const video = document.getElementById('video');
const playBtn = document.getElementById('playBtn');
const urlInput = document.getElementById('urlInput');
const fileInput = document.getElementById('fileInput');
const channelList = document.getElementById('channelList');

function playM3U8(url) {
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play();
    } else {
        alert("Your browser does not support M3U8 playback.");
    }
}

playBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) playM3U8(url);
});

fileInput.addEventListener('change', function () {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        parseM3U(e.target.result);
    };

    reader.readAsText(file);
});

function parseM3U(content) {
    channelList.innerHTML = "";
    const lines = content.split('\n');
    let channelName = "";

    lines.forEach(line => {
        line = line.trim();

        if (line.startsWith("#EXTINF")) {
            channelName = line.split(',')[1] || "Channel";
        } else if (line.startsWith("http")) {
            const div = document.createElement('div');
            div.className = "channel";
            div.textContent = channelName;
            div.onclick = () => playM3U8(line);
            channelList.appendChild(div);
        }
    });
}
const fullscreenBtn = document.getElementById('fullscreenBtn');

fullscreenBtn.addEventListener('click', () => {
	

	
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
});
