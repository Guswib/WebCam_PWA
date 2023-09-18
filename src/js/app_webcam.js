console.log("Running app_webcam.js");

//find all webcames

let permission=0;



const permissionDescriptors = [
  {name: 'camera'},
  {name: 'microphone'},
];




navigator.mediaDevices.enumerateDevices().then(function (devices) {
  var cameras=0;
  
    var option1 = document.createElement('option');
            option1.value = -1;
            option1.text = "none";
            document.querySelector('select#webcam-selecter').appendChild(option1);

    navigator.permissions.query({ name: "camera" }).then(res => {
              if(res.state == "granted"){
                console.log("Permission is granted");
              }else {console.log("Permission is not granted");}
          });
    for(var i = 0; i < devices.length; i ++){
        var device = devices[i];
        if (device.kind === 'videoinput') {
            var option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || 'camera ' + (i + 1);
            document.querySelector('select#webcam-selecter').appendChild(option);
            cameras=cameras+1;
        }
    };
    console.log("Finding cameras:"+ cameras); 
});

//find all webcames

function Check_videoPermission()
{
  let permission=0;
  navigator.permissions.query({ name: "camera" }).then(res => {
    if(res.state == "granted"){
      console.log("Permission is granted");
    }else {console.log("Permission is not granted");}
  });

}

function start_video(deviceId_selected)
{
    var video = document.querySelector("#videoElement");

    var devices = navigator.mediaDevices.enumerateDevices();
    for(var i = 0; i < devices.length; i ++){
        var device = devices[i];
        if (device.deviceId === deviceId_selected) {
           
        }
    };

    if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
    video.srcObject = stream;
    })
    .catch(function (err0r) {
    console.log("Something went wrong!");
    });
    }
}


async function start_video2(deviceId)
{
    let stream = null;
    var video = document.querySelector("#videoElement");

    console.log("new " );
    console.log(deviceId );
    if (deviceId == -1) {
        stream = video.srcObject;
        const tracks = stream.getTracks();
  
        tracks.forEach((track) => {
          track.stop();
        });
    }else{

    if (deviceId) {
        const constraints = {
          //audio: true,
          video: { deviceId: { exact: deviceId } }
        };
       // navigator.mediaDevices.getUserMedia(constraints).then(gotStream);
       stream = await navigator.mediaDevices.getUserMedia(constraints);
       video.srcObject = stream;
       console.log('new stream.');
      } else {
        console.error('Unable to connect to stream.');
       
    
      }
    }
   // video.srcObject = stream;

    

  
  
   console.log(video.srcObject );


   
    
}

function gotStream (stream) {
    // Tell the vMix Call session to switch to a different stream.
    try {
      session.gotLocalStream(stream);
    } catch {
      console.error('Unable to trigger vMix Call session stream update.');
    }
  }