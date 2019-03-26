document.querySelector("#message").innerHTML =
    "getUserMedia" in navigator.mediaDevices
        ? "api is exist"
        : "api is not exist";

const constraints = {
    audio: false,
    video: {
        width: 180,
        height: 320,
        facingMode: { exact: "environment" }
    }
};
window.navigator.mediaDevices
      .getUserMedia(constraints)
      .then(mediaStream => {
          const video = document.querySelector("video");
          video.srcObject = mediaStream;
          video.onloadedmetadata = e => {
              video.play();
          };
      })
      .catch(err => {
          document.querySelector("#error").innerHTML = err.name + ": " + err.message;
      });
const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const take = document.querySelector("#take");
const upload = document.querySelector("#upload");

const drawImage = () => {
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
};
const uploadImg = () => {
    canvas.toBlob(blob => {
        const formData = new FormData();
        formData.append("img", blob);
        formData.append("123", "123");
        fetch("/api/upload", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .catch(error => console.error("Error:", error))
            .then(response => console.log("Success:", response));
    });
};
take.addEventListener("click", drawImage);
upload.addEventListener("click", uploadImg);
