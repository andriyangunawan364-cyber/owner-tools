"use strict";


/* =====================================================
   NAVIGASI
===================================================== */

const navigationButtons =
  document.querySelectorAll(".nav-btn");

const pages =
  document.querySelectorAll(".page");


navigationButtons.forEach(button => {

  button.addEventListener("click", () => {

    navigationButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    const target =
      button.dataset.page;

    pages.forEach(page => {

      page.classList.toggle(
        "active",
        page.id === target
      );

    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });

});


/* =====================================================
   KALKULATOR
===================================================== */

let calculatorExpression = "";

let calculatorJustCalculated = false;


const calculatorExpressionElement =
  document.getElementById(
    "calculatorExpression"
  );

const calculatorResultElement =
  document.getElementById(
    "calculatorResult"
  );


function calculateExpression(expression) {

  if (!expression) {
    return 0;
  }

  let safeExpression =
    expression
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");

  safeExpression =
    safeExpression.replace(
      /(\d+(?:\.\d+)?)%/g,
      "($1/100)"
    );

  /*
   * Hanya karakter kalkulator yang diperbolehkan.
   * Ini mencegah input arbitrary JavaScript.
   */

  if (
    !/^[0-9+\-*/().\s%]+$/.test(
      safeExpression
    )
  ) {
    throw new Error("Invalid expression");
  }

  const result =
    Function(
      `"use strict"; return (${safeExpression})`
    )();

  if (!Number.isFinite(result)) {
    throw new Error("Invalid result");
  }

  return Number(
    result.toPrecision(12)
  );

}


function updateCalculator() {

  calculatorExpressionElement.textContent =
    calculatorExpression || "0";

  try {

    calculatorResultElement.textContent =
      calculatorExpression
        ? calculateExpression(
            calculatorExpression
          )
        : "0";

  } catch {

    calculatorResultElement.textContent =
      "…";

  }

}


document
  .querySelectorAll(
    ".calculator-buttons button"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const action =
          button.dataset.action;

        const value =
          button.dataset.value;


        if (action === "clear") {

          calculatorExpression = "";

          calculatorJustCalculated = false;

        }


        else if (
          action === "backspace"
        ) {

          calculatorExpression =
            calculatorExpression.slice(
              0,
              -1
            );

        }


        else if (action === "equals") {

          try {

            calculatorExpression =
              String(
                calculateExpression(
                  calculatorExpression
                )
              );

            calculatorJustCalculated =
              true;

          } catch {

            calculatorResultElement.textContent =
              "Error";

          }

        }


        else if (value) {

          if (
            calculatorJustCalculated &&
            /[0-9.]/.test(value)
          ) {

            calculatorExpression = "";

          }

          calculatorJustCalculated =
            false;

          calculatorExpression += value;

        }


        updateCalculator();

      }
    );

  });


document
  .getElementById(
    "clearCalculator"
  )
  .addEventListener(
    "click",
    () => {

      calculatorExpression = "";

      calculatorJustCalculated = false;

      updateCalculator();

    }
  );


document.addEventListener(
  "keydown",
  event => {

    if (
      !document
        .getElementById("calculator")
        .classList
        .contains("active")
    ) {
      return;
    }


    if (
      /^[0-9.]$/.test(event.key) ||
      "+-*/%()".includes(event.key)
    ) {

      calculatorExpression +=
        event.key;

      updateCalculator();

    }


    else if (
      event.key === "Enter" ||
      event.key === "="
    ) {

      try {

        calculatorExpression =
          String(
            calculateExpression(
              calculatorExpression
            )
          );

        updateCalculator();

      } catch {

        calculatorResultElement.textContent =
          "Error";

      }

    }


    else if (
      event.key === "Backspace"
    ) {

      calculatorExpression =
        calculatorExpression.slice(
          0,
          -1
        );

      updateCalculator();

    }


    else if (
      event.key === "Escape"
    ) {

      calculatorExpression = "";

      updateCalculator();

    }

  }
);


updateCalculator();


/* =====================================================
   10 TIMER INDEPENDEN
===================================================== */

const timerGrid =
  document.getElementById(
    "timerGrid"
  );


const timers =
  Array.from(
    { length: 10 },
    (_, index) => ({

      id: index + 1,

      total: 5 * 60,

      remaining: 5 * 60,

      running: false,

      finished: false,

      interval: null,

      lastTick: 0

    })
  );


function formatTimer(seconds) {

  seconds =
    Math.max(
      0,
      Math.floor(seconds)
    );


  const hours =
    Math.floor(
      seconds / 3600
    );


  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    );


  const secs =
    seconds % 60;


  return [
    hours,
    minutes,
    secs
  ]
    .map(
      value =>
        String(value)
          .padStart(2, "0")
    )
    .join(":");

}


timerGrid.innerHTML =
  timers
    .map(timer => {

      return `

        <article
          class="timer-card"
        >

          <span class="timer-name">
            Timer ${timer.id}
          </span>

          <span
            class="timer-state"
            id="timerState${timer.id}"
          >
            Siap
          </span>

          <div
            class="timer-display"
            id="timerDisplay${timer.id}"
          >
            00:05:00
          </div>


          <div class="time-inputs">

            <input
              id="timerHours${timer.id}"
              type="number"
              min="0"
              max="99"
              value="0"
              placeholder="Jam"
            >

            <input
              id="timerMinutes${timer.id}"
              type="number"
              min="0"
              max="59"
              value="5"
              placeholder="Menit"
            >

            <input
              id="timerSeconds${timer.id}"
              type="number"
              min="0"
              max="59"
              value="0"
              placeholder="Detik"
            >

          </div>


          <div class="controls">

            <button
              onclick="startTimer(${timer.id})"
            >
              ▶ Mulai
            </button>

            <button
              onclick="pauseTimer(${timer.id})"
            >
              ⏸ Jeda
            </button>

            <button
              onclick="resetTimer(${timer.id})"
            >
              ↺ Reset
            </button>

          </div>

        </article>

      `;

    })
    .join("");


function getTimer(
  id
) {

  return timers[id - 1];

}


function getTimerInput(
  timer
) {

  const hours =
    Math.max(
      0,
      Number(
        document.getElementById(
          `timerHours${timer.id}`
        ).value
      ) || 0
    );


  const minutes =
    Math.min(
      59,
      Math.max(
        0,
        Number(
          document.getElementById(
            `timerMinutes${timer.id}`
          ).value
        ) || 0
      )
    );


  const seconds =
    Math.min(
      59,
      Math.max(
        0,
        Number(
          document.getElementById(
            `timerSeconds${timer.id}`
          ).value
        ) || 0
      )
    );


  return (
    hours * 3600 +
    minutes * 60 +
    seconds
  );

}


function renderTimer(
  timer
) {

  const display =
    document.getElementById(
      `timerDisplay${timer.id}`
    );


  const state =
    document.getElementById(
      `timerState${timer.id}`
    );


  display.textContent =
    formatTimer(
      timer.remaining
    );


  display.classList.toggle(
    "finished",
    timer.finished
  );


  if (timer.finished) {

    state.textContent =
      "Selesai!";

  }

  else if (timer.running) {

    state.textContent =
      "Berjalan";

  }

  else {

    state.textContent =
      "Dijeda";

  }

}


function stopTimer(
  timer
) {

  if (timer.interval) {

    clearInterval(
      timer.interval
    );

    timer.interval = null;

  }

  timer.running = false;

}


function startTimer(
  id
) {

  const timer =
    getTimer(id);


  if (timer.running) {
    return;
  }


  if (
    timer.remaining <= 0
  ) {

    timer.remaining =
      getTimerInput(timer);

    timer.finished = false;

  }


  if (
    timer.remaining <= 0
  ) {

    return;

  }


  timer.finished = false;

  timer.running = true;

  timer.lastTick =
    Date.now();


  renderTimer(timer);


  /*
   * Interval dibuat per timer.
   *
   * Jadi Timer 1 tidak pernah
   * menggunakan interval Timer 2.
   */

  timer.interval =
    setInterval(
      () => {

        const now =
          Date.now();


        const elapsed =
          Math.floor(
            (now - timer.lastTick) /
            1000
          );


        if (
          elapsed > 0
        ) {

          timer.remaining =
            Math.max(
              0,
              timer.remaining -
              elapsed
            );


          timer.lastTick +=
            elapsed * 1000;


          renderTimer(timer);


          if (
            timer.remaining <= 0
          ) {

            stopTimer(timer);

            timer.finished = true;

            renderTimer(timer);


            try {

              if (
                navigator.vibrate
              ) {

                navigator.vibrate([
                  200,
                  100,
                  200
                ]);

              }

            } catch {}

          }

        }

      },
      200
    );

}


function pauseTimer(
  id
) {

  const timer =
    getTimer(id);

  stopTimer(timer);

  renderTimer(timer);

}


function resetTimer(
  id
) {

  const timer =
    getTimer(id);

  stopTimer(timer);

  timer.remaining =
    getTimerInput(timer);

  timer.total =
    timer.remaining;

  timer.finished = false;

  renderTimer(timer);

}


window.startTimer =
  startTimer;

window.pauseTimer =
  pauseTimer;

window.resetTimer =
  resetTimer;


timers.forEach(
  renderTimer
);


document
  .getElementById(
    "resetAllTimers"
  )
  .addEventListener(
    "click",
    () => {

      timers.forEach(
        timer => {

          stopTimer(timer);

          timer.remaining =
            5 * 60;

          timer.total =
            5 * 60;

          timer.finished =
            false;


          document.getElementById(
            `timerHours${timer.id}`
          ).value = 0;


          document.getElementById(
            `timerMinutes${timer.id}`
          ).value = 5;


          document.getElementById(
            `timerSeconds${timer.id}`
          ).value = 0;


          renderTimer(timer);

        }
      );

    }
  );


/* =====================================================
   STOPWATCH
===================================================== */

let stopwatchRunning =
  false;

let stopwatchElapsed =
  0;

let stopwatchStartedAt =
  0;

let stopwatchInterval =
  null;

let lapNumber =
  0;


const stopwatchDisplay =
  document.getElementById(
    "stopwatchDisplay"
  );


function formatStopwatch(
  milliseconds
) {

  const minutes =
    Math.floor(
      milliseconds / 60000
    );


  const seconds =
    Math.floor(
      milliseconds / 1000
    ) % 60;


  const ms =
    Math.floor(
      milliseconds % 1000
    );


  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0") +
    "." +
    String(ms).padStart(3, "0")
  );

}


function renderStopwatch() {

  stopwatchDisplay.textContent =
    formatStopwatch(
      stopwatchElapsed
    );

}


document
  .getElementById(
    "startStopwatch"
  )
  .addEventListener(
    "click",
    () => {

      if (
        stopwatchRunning
      ) {

        stopwatchRunning =
          false;

        clearInterval(
          stopwatchInterval
        );

        stopwatchInterval =
          null;


        stopwatchElapsed =
          performance.now() -
          stopwatchStartedAt;


        document.getElementById(
          "startStopwatch"
        ).textContent =
          "▶ Lanjut";

      }

      else {

        stopwatchRunning =
          true;


        stopwatchStartedAt =
          performance.now() -
          stopwatchElapsed;


        stopwatchInterval =
          setInterval(
            () => {

              stopwatchElapsed =
                performance.now() -
                stopwatchStartedAt;

              renderStopwatch();

            },
            20
          );


        document.getElementById(
          "startStopwatch"
        ).textContent =
          "⏸ Jeda";

      }

    }
  );


document
  .getElementById(
    "lapStopwatch"
  )
  .addEventListener(
    "click",
    () => {

      if (
        !stopwatchRunning
      ) {

        return;

      }


      lapNumber++;


      const row =
        document.createElement(
          "div"
        );


      row.className =
        "lap-item";


      row.innerHTML = `
        <span>Lap ${lapNumber}</span>
        <strong>
          ${formatStopwatch(
            stopwatchElapsed
          )}
        </strong>
      `;


      document
        .getElementById(
          "lapList"
        )
        .prepend(row);

    }
  );


document
  .getElementById(
    "resetStopwatch"
  )
  .addEventListener(
    "click",
    () => {

      stopwatchRunning =
        false;


      clearInterval(
        stopwatchInterval
      );


      stopwatchInterval =
        null;


      stopwatchElapsed =
        0;


      lapNumber =
        0;


      document.getElementById(
        "lapList"
      ).innerHTML = "";


      document.getElementById(
        "startStopwatch"
      ).textContent =
        "▶ Mulai";


      renderStopwatch();

    }
  );


renderStopwatch();


/* =====================================================
   QR GENERATOR
===================================================== */

let generatedQR =
  null;


document
  .getElementById(
    "generateQR"
  )
  .addEventListener(
    "click",
    async () => {

      const name =
        document
          .getElementById(
            "paymentName"
          )
          .value
          .trim() ||
        "Penerima";


      const method =
        document
          .getElementById(
            "paymentMethod"
          )
          .value;


      const amount =
        Math.max(
          0,
          Number(
            document
              .getElementById(
                "paymentAmount"
              )
              .value
          ) || 0
        );


      const note =
        document
          .getElementById(
            "paymentNote"
          )
          .value
          .trim() ||
        "-";


      const paymentData = {

        type: "PAYMENT",

        name,

        method,

        amount,

        note,

        createdAt:
          new Date().toISOString()

      };


      const qrBox =
        document.getElementById(
          "qrResult"
        );


      qrBox.innerHTML = "";


      generatedQR =
        document.createElement(
          "canvas"
        );


      qrBox.appendChild(
        generatedQR
      );


      if (
        typeof QRCode ===
        "undefined"
      ) {

        qrBox.textContent =
          "Library QR tidak tersedia. Pastikan internet aktif.";

        return;

      }


      await QRCode.toCanvas(
        generatedQR,
        JSON.stringify(
          paymentData
        ),
        {
          width: 230,
          margin: 2,
          errorCorrectionLevel: "M"
        }
      );


      document.getElementById(
        "downloadQR"
      ).disabled = false;

    }
  );


document
  .getElementById(
    "downloadQR"
  )
  .addEventListener(
    "click",
    () => {

      if (!generatedQR) {
        return;
      }


      const link =
        document.createElement(
          "a"
        );


      link.download =
        "utility-hub-qr.png";


      link.href =
        generatedQR.toDataURL(
          "image/png"
        );


      link.click();

    }
  );


/* =====================================================
   QR SCANNER
===================================================== */

let cameraStream =
  null;

let scannerFrame =
  null;

let barcodeDetector =
  null;


const camera =
  document.getElementById(
    "camera"
  );


const scanResult =
  document.getElementById(
    "scanResult"
  );


async function startScanner() {

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    scanResult.textContent =
      "Browser tidak mendukung kamera.";

    return;

  }


  if (
    !("BarcodeDetector" in window)
  ) {

    scanResult.textContent =
      "BarcodeDetector belum tersedia di browser ini. Gunakan browser terbaru atau upload gambar QR.";

    return;

  }


  try {

    barcodeDetector =
      new BarcodeDetector({
        formats: [
          "qr_code"
        ]
      });


    cameraStream =
      await navigator
        .mediaDevices
        .getUserMedia({

          video: {
            facingMode: {
              ideal:
                "environment"
            }
          },

          audio: false

        });


    camera.srcObject =
      cameraStream;


    await camera.play();


    scanCamera();

  }

  catch {

    scanResult.textContent =
      "Kamera tidak dapat dibuka. Izinkan akses kamera.";

  }

}


async function scanCamera() {

  if (!cameraStream) {
    return;
  }


  try {

    const codes =
      await barcodeDetector.detect(
        camera
      );


    if (
      codes.length > 0
    ) {

      scanResult.textContent =
        codes[0].rawValue ||
        "QR berhasil dibaca.";


      stopScanner();

      return;

    }

  }

  catch {

    // Scan berikutnya tetap dicoba.

  }


  scannerFrame =
    requestAnimationFrame(
      scanCamera
    );

}


function stopScanner() {

  if (
    scannerFrame
  ) {

    cancelAnimationFrame(
      scannerFrame
    );

    scannerFrame =
      null;

  }


  if (
    cameraStream
  ) {

    cameraStream
      .getTracks()
      .forEach(
        track =>
          track.stop()
      );


    cameraStream =
      null;

  }


  camera.srcObject =
    null;

}


document
  .getElementById(
    "startScanner"
  )
  .addEventListener(
    "click",
    startScanner
  );


document
  .getElementById(
    "stopScanner"
  )
  .addEventListener(
    "click",
    stopScanner
  );


/* =====================================================
   QR DARI GAMBAR
===================================================== */

document
  .getElementById(
    "qrImage"
  )
  .addEventListener(
    "change",
    async event => {

      const file =
        event.target.files[0];


      if (!file) {
        return;
      }


      if (
        !("BarcodeDetector" in window)
      ) {

        scanResult.textContent =
          "Browser belum mendukung pembacaan QR dari gambar.";

        return;

      }


      try {

        const detector =
          new BarcodeDetector({
            formats: [
              "qr_code"
            ]
          });


        const bitmap =
          await createImageBitmap(
            file
          );


        const codes =
          await detector.detect(
            bitmap
          );


        if (
          codes.length > 0
        ) {

          scanResult.textContent =
            codes[0].rawValue;

        }

        else {

          scanResult.textContent =
            "QR tidak ditemukan pada gambar.";

        }


        bitmap.close();

      }

      catch {

        scanResult.textContent =
          "Gagal membaca gambar QR.";

      }

    }
  );


/* =====================================================
   CLEANUP
===================================================== */

window.addEventListener(
  "beforeunload",
  () => {

    timers.forEach(
      timer => stopTimer(timer)
    );


    clearInterval(
      stopwatchInterval
    );


    stopScanner();

  }
);