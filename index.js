const button = document.querySelector("#openCam");
const closeButton = document.getElementById("closeCam");
const image = document.getElementById("image");
const resultsContainer = document.getElementById("results");
const video = document.querySelector("#video");
const classifier = ml5.imageClassifier("MobileNet", modelLoaded);
const classifierVideo = ml5.imageClassifier("MobileNet", video, modelLoaded);
const state = document.getElementById("status");

function handleOpenCam() {
  state.textContent = "carregando";
  navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(function (mediaStream) {
    video.srcObject = mediaStream;
    video.play();
    state.textContent = "";
    classifierVideo.predict(video, results => resultsContainer.innerText = results[0].label)
    })
    .catch(function (err) {
      console.log("Não há permissões para acessar a webcam");
      document.getElementById("status").textContent = `${err.message}`;
    });
}

function handleCloseCam() {
  state.textContent = 'carregando';
  navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(function (mediaStream) {
    video.srcObject = null;
    video.pause();
    mediaStream.getVideoTracks()[0].stop();
    state.textContent = "";
    classifierVideo.predict(video, results => resultsContainer.innerText = results[0].label)
    })
    .catch(function (err) {
      document.getElementById("status").textContent = `${err.message}`;
    });
}

function handlePicture() {
  navigator.mediaDevices.getUserMedia()
}



function modelLoaded() {
  console.log("Model Loaded!");
}
function handleImage() {
  classifier.predict(document.getElementById("image"), (err, results) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(results)
      results.map((result) => {
        resultsContainer.insertAdjacentHTML('beforeend',`<hr/><p>name:${result.label} <br/> confidence:<strong>${result.confidence.toFixed(2)}</strong> </p> <hr/> `)  ;
      })
    }
  });
}

button.addEventListener("click", () => handleOpenCam());
closeButton.addEventListener("click", () => handleCloseCam());
image.addEventListener("click", () => handleImage());


// const loop = classifier => {
//   classifier.classify().then(results => {
//     results.innerText = results[0].label;
//     probability.innerText = results[0].confidence.toFixed(4);
//     loop(classifier); // Call again to create a loop
//   });
// };

// Initialize the Image Classifier method with MobileNet passing the video as the
// second argument and the getClassification function as the third
