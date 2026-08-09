/*
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let mouseX = 0;
let mouseY = 0;

function tilpasCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    tegn();
}

canvas.addEventListener("mousemove", function(event) {

    const rect = canvas.getBoundingClientRect();

    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    tegn();
});

function tegn() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Testtekst
    ctx.font = "20px Arial";
    ctx.fillText("Wall Stability - test", 30, 40);

    // Testpunkt der følger musen
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 10, 0, Math.PI * 2);
    ctx.fill();
}

window.addEventListener("resize", tilpasCanvas);

tilpasCanvas();
*/