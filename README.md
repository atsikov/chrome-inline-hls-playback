# Inline HLS Playback
Extension for Chrome allowing HLS video playback.
Based on hls.js library (https://github.com/video-dev/hls.js/).
# How it works
Extension injects script into each frame and listens for errors. If error was triggered by video element because of unsupported format, extension checks media url and enables hlsjs support if needed.