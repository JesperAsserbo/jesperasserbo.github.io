// Fælles funktioner
document.addEventListener("DOMContentLoaded", function () {

    const disclaimerCheck = document.getElementById("disclaimerCheck");
    const programLinks = document.querySelectorAll(".program-link");

    function opdaterProgrammer() {

        programLinks.forEach(function (program) {

            if (disclaimerCheck.checked) {
                program.classList.remove("disabled");
            } else {
                program.classList.add("disabled");
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