console.log("Content Runing");

//listening to popup
chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message, sender, sendResponse) {
  if (message){
    getInfoPage()
    sendResponse({infoUpdated: true})
  }
}

function getInfoPage(){
  var address = window.location.href
  var title = document.getElementsByTagName('title')[0].innerHTML
  //sending data to background
  var infoPage = {
    class: "infoPage",
    address: address,
    title : title
  }
  chrome.runtime.sendMessage(infoPage);
}
