console.log('background running');

window.infoPage = "blank";
chrome.runtime.onMessage.addListener(receiver);
//save in var for make avaliable on popUp
function receiver (request, sender, sendResponse){
console.log(request)
  if (request.class === "infoPage"){
    window.infoPage = request;
    console.log(window.infoPage)
    sendResponse({infoOK:true})
  }
}
