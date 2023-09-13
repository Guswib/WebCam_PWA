console.log("Running app_main.js");

var dropdown_webCamSelect;
var selectedValue = -1;


function change_webcam()
{
selectedValue = dropdown_webCamSelect.options[dropdown_webCamSelect.selectedIndex].value;
alert(selectedValue);
start_video2(selectedValue);

}


onload = function() {

    dropdown_webCamSelect = document.getElementById("webcam-selecter");
    document.getElementById("webcam-selecter").onchange        = function () { change_webcam("") };

}

