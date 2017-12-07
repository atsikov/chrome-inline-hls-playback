var hlsJsState = 0;
var hlsJsReadyCallbacks = [];

function injectJs(link) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = link;
    (document.head || document.body || document.documentElement).appendChild(script);
}

function loadHlsJs(callback) {
    if (hlsJsState === 0) {
        injectJs(chrome.runtime.getURL("injectHlsJs.js"));
        hlsJsState = 1;
    }

    if (hlsJsState === 1) {
        hlsJsReadyCallbacks.push(callback);
    }
}

function onHlsReady(isSupported) {
    hlsJsState = isSupported ? 2 : -1;
    hlsJsReadyCallbacks.forEach(callback => callback());
}

function getVideoId() {
    Array(24).fill().map(el => String.fromCharCode(Math.random() * 26 + 97));
}

function onVideoError(video) {
    if (hlsJsState === 0) {
        loadHlsJs(function() { onVideoError(video) });
    } else if (hlsJsState === 2) {
        let videoId = video.getAttribute("inline-hls-playback---video-id-kehipngobldbojbjajaibogdmajikoap");
        if (!videoId) {
            videoId = getVideoId();
            video.setAttribute("inline-hls-playback---video-id-kehipngobldbojbjajaibogdmajikoap", videoId);
        }

        window.postMessage({ type: "START_HLS_PLAYBACK", videoId: videoId }, "*");
    }
}

function isUnsupportedHlsVideo(element) {
    return (element instanceof HTMLVideoElement) &&
        element.error &&
        element.error.code === 4 &&
        element.src &&
        element.src.match(/\.m3u8($|\?)/);
}

function onWindowError(event) {
    const target = event.target;
    if (isUnsupportedHlsVideo(target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        onVideoError(target);
    }
}

document.addEventListener("error", onWindowError, true);

const videos = document.querySelectorAll("video");
if (videos.length) {
    for (var i = 0; i < videos.length; i++) {
        if (isUnsupportedHlsVideo(videos[i])) {
            onVideoError(videos[i]);
        }
    }
}

window.addEventListener("message", function(event) {
    if (event.source !== window)
        return;

    if (event.data.type && (event.data.type === "HLS_READY")) {
        onHlsReady(event.data.isSupported);
    }
}, false);
