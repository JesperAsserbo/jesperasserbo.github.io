// Fælles funktioner
document.addEventListener("DOMContentLoaded", function () {

    const disclaimerCheck = document.getElementById("disclaimerCheck");
    const programLinks = document.querySelectorAll(".program-link");
    const watermarks = document.querySelectorAll(".disclaimer-watermark");

function opdaterProgrammer() {

    programLinks.forEach(function (program) {

        const watermark = program.querySelector(".disclaimer-watermark");

        if (disclaimerCheck.checked) {

            program.classList.remove("disabled");

            if (watermark) {
                watermark.style.display = "none";
            }

        } else {

            program.classList.add("disabled");

            if (watermark) {
                watermark.style.display = "block";
            }
        }

    });
}


    programLinks.forEach(function (program) {

        program.addEventListener("click", function (event) {

            if (!disclaimerCheck.checked) {

                event.preventDefault();

                alert("Please read and accept the disclaimer before using the programs.");

            }

        });

    });


    disclaimerCheck.addEventListener("change", opdaterProgrammer);

    opdaterProgrammer();

});