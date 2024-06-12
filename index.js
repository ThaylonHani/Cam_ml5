const video = document.getElementById("video");
const result = document.getElementById("result");
const confidence = document.getElementById("confidence");
const message = document.getElementById("message");
const resultContainer = document.getElementById("result-container");
const table = document.getElementById("table");
const tableResult = document.getElementById("table-result");
const buttonCam = document.getElementById("button-cam");
const buttonSwapCam = document.getElementById("swap-cam");
let arrayConfidences = [{}];
let cam = false;
function handleOpenCam() {
  if (cam) {
    cam = false;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      message.innerText = "Closing cam";
      video.srcObject = null;
      resultContainer.innerText = "";
      result.innerText = "";
      video.stop();
      stream.getVideoTracks()[0].stop();
    });
  } else {
    cam = true;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      message.innerText = "Opening Cam and loading model";
      video.srcObject = stream;
      video.play();
      video.style.transform = "scaleX(-1)";
    });
  }
}
function modelLoaded(classifier) {
  console.log("model loaded");
  setTimeout(() => {
    loop(classifier);
  },2000)
}
const loop = (classifier) => {
  message.innerText = "";
  classifier.classify().then((results) => {
    resultContainer.innerHTML = "";
    results.map((result) => {
      if (
        result.confidence > 0.7 &&
        arrayConfidences.findIndex((item) => item.name == result.label) == -1
      ) {
        arrayConfidences.push(...arrayConfidences, {
          name: result.label,
          confidence: result.confidence,
        });
        handleTable(result.label, result.confidence);
      }
      resultContainer.insertAdjacentHTML(
        "beforeend",
        `
        <section id="result-content">
          <p id="result">${result.label}</p>
        <strong id="confidence">${result.confidence.toFixed(2)}</strong>
        </section>
        `
      );
    });
    setTimeout(() => {
      loop(classifier);
    }, 1000);
  });
};
function handleTable(name, confidence) {
  if (arrayConfidences.length > 0) {
    tableResult.insertAdjacentHTML(
      "beforebegin",
      `
          <td>${name}</td>
          <td>${confidence.toFixed(2)}</td>
        `
    );
  }
}

ml5.imageClassifier("MobileNet", video).then((classifier) => modelLoaded(classifier));
buttonCam.addEventListener("click", () => handleOpenCam());
