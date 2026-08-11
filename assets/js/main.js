
// ================================================
// Fælles funktioner
// ================================================

document.addEventListener("DOMContentLoaded", function () {

    const disclaimerCheck =
        document.getElementById("disclaimerCheck");

    const programLinks =
        document.querySelectorAll(".program-link");


    // ================================================
    // Opdater programmer
    // ================================================

    function opdaterProgrammer() {

        programLinks.forEach(function (program) {

            const watermark =
                program.querySelector(".disclaimer-watermark");

            const tooltip =
                program.querySelector(".mouse-tooltip");


            if (disclaimerCheck.checked) {

                // --------------------------------
                // Disclaimer accepteret
                // --------------------------------

                program.classList.remove("disabled");

                if (watermark) {
                    watermark.style.display = "none";
                }

                if (tooltip) {
                    tooltip.style.display = "none";
                }

            } else {

                // --------------------------------
                // Disclaimer ikke accepteret
                // --------------------------------

                program.classList.add("disabled");

                if (watermark) {
                    watermark.style.display = "block";
                }
            }

        });
    }


    // ================================================
    // Klik på program
    // ================================================

    programLinks.forEach(function (program) {

        program.addEventListener("click", function (event) {

            if (!disclaimerCheck.checked) {

                event.preventDefault();
                event.stopPropagation();

                alert(
                    "Please read and accept the disclaimer before using the programs."
                );

                return false;
            }

        });

    });


    // ================================================
    // Tekst ved musen
    // ================================================

    programLinks.forEach(function (program) {

        const tooltip =
            program.querySelector(".mouse-tooltip");

        if (!tooltip) {
            return;
        }


        program.addEventListener("mousemove", function (event) {

            /*
            if (!disclaimerCheck.checked) {
                const rect = program.getBoundingClientRect();

                tooltip.style.display = "block";

                tooltip.style.left =
                (event.clientX - rect.left - 15) + "px";

                tooltip.style.top =
                (event.clientY - rect.top - 35) + "px";

            } else {

                tooltip.style.display = "none";
            }
            */

        });


    

        program.addEventListener("mouseenter", function () {

    if (!disclaimerCheck.checked) {
        tooltip.style.display = "block";
    }

});

program.addEventListener("mouseleave", function () {

    tooltip.style.display = "none";

});

    });


    // ================================================
    // Checkbox
    // ================================================

    disclaimerCheck.addEventListener(
        "change",
        opdaterProgrammer
    );


    // ================================================
    // Start
    // ================================================

    opdaterProgrammer();

});

