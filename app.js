// 建立 AudioContext
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioElement = document.getElementById("audioPlayer");
let fileInput = document.getElementById("audioFile");
let pitchControl = document.getElementById("pitchControl");

// 建立音訊節點
let sourceNode;
let pitchShifter = audioContext.createBiquadFilter();
pitchShifter.type = "allpass"; // 讓音高變化更平滑

// 監聽檔案上傳
fileInput.addEventListener("change", function(event) {
    let file = event.target.files[0];
    if (file) {
        let objectURL = URL.createObjectURL(file);
        audioElement.src = objectURL;
    }
});

// 監聽播放事件，建立音訊管道
audioElement.addEventListener("play", function() {
    if (!sourceNode) {
        sourceNode = audioContext.createMediaElementSource(audioElement);
        sourceNode.connect(pitchShifter).connect(audioContext.destination);
    }
});

// 音高調整
pitchControl.addEventListener("input", function() {
    let pitchValue = parseFloat(this.value);
    let newFrequency = 1000 + (pitchValue * 100); // 假設範圍 -12 ~ +12
    pitchShifter.frequency.value = newFrequency;
});

// 註冊Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service Worker 註冊成功"))
    .catch(error => console.log("Service Worker 註冊失敗", error));
}
