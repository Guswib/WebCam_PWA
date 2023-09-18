
console.log("running: app_ini.js")


//redirect if not https
if(window.location.href.startsWith('http://127.0.0.1')){
    console.log("href "+window.location.href + " - local site");
}else{
    if (location.protocol !== "https:"){ 
        console.log("not https, redirecting");
        location.replace(window.location.href.replace("http:", "https:")); } 
}


  