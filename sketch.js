<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Facemesh Example</title>
  <!-- 引入 p5.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.js"></script>
  <!-- 引入支持 facemesh 的 ml5.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/ml5/0.12.2/ml5.min.js"></script>
  <!-- 引入 sketch.js -->
  <script src="sketch.js"></script>
</head>
<body>
</body>
</html>

let facemesh;
let video;
let predictions = [];

// 指定的點編號
const points = [
  409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 facemesh 模型
  facemesh = ml5.facemesh(video, modelReady);

  // 當模型偵測到臉部時，更新 predictions
  facemesh.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  // 顯示攝像頭影像
  image(video, 0, 0, width, height);

  // 如果有偵測到臉部，繪製線條
  if (predictions.length > 0) {
    drawConnections();
  }
}

function drawConnections() {
  noFill();
  stroke(255, 0, 0); // 紅色線條
  strokeWeight(5); // 線條粗細

  // 確保 predictions 有數據
  if (predictions.length === 0 || !predictions[0].scaledMesh) {
    console.warn("No face detected or invalid data.");
    return;
  }

  // 取得第一個偵測到的臉部
  const keypoints = predictions[0].scaledMesh;

  // 根據指定的點編號繪製線條
  for (let i = 0; i < points.length - 1; i++) {
    const startIdx = points[i];
    const endIdx = points[i + 1];

    // 確保索引在範圍內
    if (startIdx < keypoints.length && endIdx < keypoints.length) {
      const start = keypoints[startIdx];
      const end = keypoints[endIdx];

      if (start && end) {
        line(start[0], start[1], end[0], end[1]);
      } else {
        console.warn(`Invalid points: ${startIdx} or ${endIdx}`);
      }
    } else {
      console.warn(`Point index out of range: ${startIdx} or ${endIdx}`);
    }
  }
}