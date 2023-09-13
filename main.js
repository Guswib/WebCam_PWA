console.log("Running main.js");



var lastE=0.0;
var lastI=0.0;
var lastT=0.0;


function setPosition(position) {
  var buffer = new ArrayBuffer(1);
  var uint8View = new Uint8Array(buffer);
  uint8View[0] = position;
  chrome.serial.send(connectionId, buffer, function() {});
};




//////////////////////////////////////////////////////////////
//ask if you want to leave page.
var onGetDevices = function(ports) {
	for (var i=0; i<ports.length; i++) {
	  console.log(ports[i].path);
	}
  }

window.addEventListener('beforeunload', function (e) {
	 
	e.preventDefault(); 
	e.returnValue = ''; 
}); 
//disconnect everything if needed. previously unload was used, but now page hide.
window.addEventListener('pagehide', function(event) {
	console.log('quiting.');
	serCOM_disconnect();
	BLE_COM_disconnect();
  });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
onload = function() {


graph_ini();
data_set_ini();
plot_data([-10,5,0,5,10,-4],[0,10,2,-10,7,12]);
plot_clear();
	setInterval(clear_tempSerial, 1000);

	setInterval(Pot_Communcation_read,100);   //read serial port
	setInterval(gui_pot_update_values,300);
	
  
//  	serialCOM_ini();

	gui_pot_ini();
	


	 // navigator.serial.getDevices(onGetDevices);
   
	document.getElementById('send_button').onchange = function () { 	
		if(connectionId != -1) {
			
			
			var textToSend = document.getElementById('send_text').value;
			var comboboxValue = document.getElementById('endofline_combobox').value
			// add the selected end of line
			if(comboboxValue == "NL") textToSend += '\n';
			else if(comboboxValue == "CR") textToSend += '\r';
			else if(comboboxValue == "NLCR") textToSend += '\r\n';
			textToSend += '\r\n';
			// send data
			writeSerial(textToSend, "");
		}
	};	
	document.getElementById('i_range').onchange = function () { onclick_CurrentMode()};	
	document.getElementById('pot_ctrl_mode').onchange = function () { onclick_CtrlMode('')};	
	document.getElementById('pot_ctrl_mode_button').onclick = function (){ dropdown_menu(dropdown_cmode); };
	document.getElementById('pot_ctrl_mode_p').onclick = function () {dropdown_cmode.style.display = "none";onclick_CtrlMode('pot')};	
	document.getElementById('pot_ctrl_mode_g').onclick = function () {dropdown_cmode.style.display = "none";onclick_CtrlMode('gal')};	
	
	document.getElementById('CellSW').onclick        = function () { onclick_CellSW()};
	document.getElementById('sel_ECtech').onchange        = function () { onclick_ECtech("") };
	
	document.getElementById('sel_ECtech_button').onclick = function () { dropdown_menu(dropdown_EC_tech);};
	document.getElementById('sel_ECtech_Set').onclick    = function () {  onclick_ECtech("gui_dirctrl"); };
	document.getElementById('sel_ECtech_Ramp').onclick   = function () { onclick_ECtech("gui_ramp");  };
	document.getElementById('sel_ECtech_Ramps').onclick  = function () { onclick_ECtech("gui_ramps"); };

	document.getElementById('sel_ECtech_Stair').onclick  = function () { onclick_ECtech("gui_stair"); };
	document.getElementById('sel_ECtech_SWR').onclick  = function () {console.log("swr"); onclick_ECtech("gui_swr"); };



	document.getElementById('sel_ECtech_Steps_2').onclick        = function () {  onclick_ECtech("gui_step"); };
	document.getElementById('sel_ECtech_Steps_3').onclick        = function () { onclick_ECtech("gui_steps"); };
	
	

	//EC Tech
	document.getElementById('Set_EXE').onclick 		= function () { onclick_Set_EXE()};	
	document.getElementById('Ramp_EXE').onclick		 = function () { onclick_Ramp_EXE()};	
	document.getElementById('Step_EXE').onclick        = function () { onclick_Step_EXE() ; };
	document.getElementById('Stair_EXE').onclick        = function () { onclick_Stair_EXE() ; };
	document.getElementById('SWR_EXE').onclick        = function () { onclick_SWR_EXE();  };


	document.getElementById('sel_Steps_nr').onchange        = function () { onclick_ECtech("") };

	document.getElementById('copy').onclick        = function () { onclick_copy()  };
	document.getElementById('Abort_EXE').onclick        = function () { onclick_Abort_EXE()  };
	document.getElementById("logo_button").onclick = function() {onclick_logo()};
	document.getElementById("Serial_Connect_button").onclick = function() {connect_to_instrument();};
	document.getElementById("Modal_Serial_Connect_button").onclick = function() {onclick_modal_serial();};
	document.getElementById("Modal_BLE_Connect_button").onclick = function() {console.log("BLE"); modal.style.display = "none";BLE_button_connect();};
	
	//plot buttons
	document.getElementById("button_autoscale").onclick = function() {onclick_autoscaleY()};
	document.getElementById("button_clear").onclick = function() {onclick_clearplot()};
	
	
	//Chech if serial is avaialble isn Browser
	IS_not_supported();
	
};


function connect_to_instrument()
{
	if(s_port){serCOM_button_connect(); return;}
	if(BLE_connected){BLE_button_connect();return;}

	modal.style.display = "block";
}


function dropdown_menu(dropdown)
{
	if(dropdown.style.display == "none"){ 
		dropdown.style.display = "block";
		//console.log("AAAABlock");
	}else{
		dropdown.style.display = "none";
		//console.log("AAAAnone");
	} 
}


onresize = function()
{
	graph_ini();
	gui_plot_redraw();
	
}

function onclick_modal_serial()
{
	modal.style.display = "none";
	var connecting=serCOM_button_connect();
	if(connecting<0){
		document.getElementById('gui_not_supported').style.display='block';
	}
}

function onclick_modal_BLE()
{ console.log("BLE"); 
	modal.style.display = "none";
	if('bluetooth' in navigator){
		BLE_button_connect();
	}
	else{
		document.getElementById('gui_not_supported').style.display='block';
	}

}

function onclick_logo() {
	console.log("LOGO PRESSED");
	window.open("https://www.nordicec.com");
  }

//////////////////////
function IS_not_supported()
{
	value=0;
	if('serial' in navigator){value=1;}
	if('bluetooth' in navigator) {value=1;}
	if(value==0){
			document.getElementById('gui_not_supported').style.display='block';
		}
}


///////////////////////////////////////7

var dropdown_cmode_button = document.getElementById("pot_ctrl_mode_button");
var dropdown_cmode = document.getElementById("pot_ctrl_mode_dropdown");
var dropdown_cmode_img = document.getElementById("pot_ctrl_mode_img");
var dropdown_cmode_img2 = document.getElementById("pot_ctrl_mode_img2");

var dropdown_EC_tech = document.getElementById("sel_ECtech_dropdown");
var dropdown_EC_tech_button = document.getElementById("sel_ECtech_button");
var dropdown_EC_tech_img = document.getElementById("sel_ECtech_img");
var dropdown_EC_tech_img2 = document.getElementById("sel_ECtech_img2");

var dropdown_EC_tech_field = document.getElementById("sel_ECtech_field");

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Callback function when new data is received

function clear_tempSerial(){ document.getElementById('rawdata').value="";}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
//var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
//btn.onclick = function() {
//  modal.style.display = "block";
//}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
	modal.style.display = "none";
  }
  if (event.target != dropdown_cmode 
	&& dropdown_cmode.style.display != "none" 
	&& event.target != dropdown_cmode_button 
	&& event.target != dropdown_cmode_img 
	&& event.target != dropdown_cmode_img2 ) {
	dropdown_cmode.style.display = "none";
  }
  if (event.target != dropdown_EC_tech 
	   && dropdown_EC_tech.style.display != "none" 
	   && event.target != dropdown_EC_tech_button 
	   && event.target != dropdown_EC_tech_img 
	   && event.target != dropdown_EC_tech_img2 ) {
	  //console.log("aa" + event.target);
	  //console.log("aa" );

	  dropdown_EC_tech.style.display = "none";
  }

}