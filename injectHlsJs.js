var hlsJsUrl = "https://cdn.jsdelivr.net/npm/hls.js@latest";
var script = document.createElement('script');
script.onload = function() {
    window.postMessage({ type: "HLS_READY", isSupported: Hls.isSupported() }, "*");
};
script.src = hlsJsUrl;
document.head.appendChild(script);

function loadVideo(video) {
    var hls = new Hls();
    hls.loadSource(video.src);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play();
    });
}

window.addEventListener("message", function(event) {
    if (event.source !== window)
        return;

    if (event.data.type && (event.data.type === "START_HLS_PLAYBACK")) {
        loadVideo(document.querySelector("video[inline-hls-playback---video-id-kehipngobldbojbjajaibogdmajikoap=" + event.data.videoId + "]"));
    }
}, false);
