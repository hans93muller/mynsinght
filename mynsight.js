console.log('Pop-up Running')
upCats();
var bgpage;
var infoPage ='';
infoPage.address ='';
document.getElementById('saveNote').addEventListener('click',saveNote);
document.getElementById('collection').addEventListener('click',()=>{chrome.runtime.openOptionsPage()});
document.getElementById('saveCat').addEventListener('click',saveNewCategory);
document.getElementById('delCat').addEventListener('click',delCat);

//open | close newCategory menu
document.getElementById('OpenNewCat').addEventListener('click',()=> {
  if (document.getElementById('MenuNewCategory').style.display === "inline"){
      document.getElementById('OpenNewCat').innerText = "New";
      document.getElementById('MenuNewCategory').style.display = "none";
  }else{
    document.getElementById('OpenNewCat').innerText = " [x] ";
    document.getElementById('MenuNewCategory').style.display = "inline";
  }
})

//send mensage to content script (RUN)
let params = {
  active : true,
  currentWindow: true
}
chrome.tabs.query(params, gotTabs);

function gotTabs(tabs){
  let msg = true;
chrome.tabs.sendMessage(tabs[0].id, msg, infoUp);
}

var url,titleNote,note,address,category;
function infoUp(response){
  //get windows var from background
  bgpage = chrome.extension.getBackgroundPage();
  infoPage = bgpage.infoPage;
  address = infoPage.address

  //get data from chrome storage
  chrome.storage.sync.get([address],
  function (data){
    if(Object.keys(data)[0] != undefined){
      url = Object.keys(data)[0];
      note = Object.values(data)[0].note;
      category = Object.values(data)[0].category;
      console.log(Object.keys(data)[0]);
      console.log(Object.values(data)[0].note);
    }
   addInfo();
  });
}

function addInfo(){
  document.getElementById('pageTitle').innerText = infoPage.title;
  if (note != undefined){
    document.getElementById('insight').value = note;
  }
  if (category != undefined){
    document.getElementById('selectorCat').value = category;
  }
}

function saveNote(){
  getNewDate();
  var newAddress = infoPage.address;
  var root = newAddress.replace('http://',"")
  console.log(root);
  newAddress.replace('https://',"")
  console.log(root);
  root = root.replace('www.',"")
  console.log(root);
  root = root.split('/')[2];
  console.log(root);
  var infos = {
  'note':document.getElementById('insight').value,
  'titlePage': infoPage.title,
  'category':document.getElementById('selectorCat').value,
  'date':dateSaved,
  "root":root
  }
  chrome.storage.sync.set({[newAddress]:infos},
    function(){
    console.log('SavedLocale');
  });
}

var dateSaved = ['hour','day','mouth','year']
function getNewDate(){
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var nT = new Date();
  dateSaved[0] = nT.getHours()+":"+nT.getMinutes();
  dateSaved[1] = nT.getDate();
  dateSaved[2] = months[nT.getMonth()];
  dateSaved[3] = nT.getFullYear();
}

function saveNewCategory(){
    chrome.storage.sync.get("Mcategories", function(data){
      console.log(data);
      console.log(Object.values(data)[0]);
      var oldCats = [];
      if (Object.values(data)[0] != undefined){
        oldCats = Object.values(data)[0];
      }
      var newCat = document.getElementById('newCategory').value;
      oldCats.push(newCat);
      console.log(oldCats);
      chrome.storage.sync.set({'Mcategories':oldCats}, upCats)
      //for user view
      document.getElementById('newCategory').classList.add('is-valid')
      setTimeout(()=>{
        document.getElementById('newCategory').value = "";
        document.getElementById('newCategory').classList.remove('is-valid')
      },2000)
    });
}
//  chrome.storage.sync.remove("Mcategories");

function upCats(){
  document.getElementById('selectorCat').innerHTML ="";
  document.getElementById('selectorCatDel').innerHTML ="";
  chrome.storage.sync.get("Mcategories", function(data){
    var cats = Object.values(data)[0];
    cats.forEach(function(element){
      var option = document.createElement("option")
      option.innerText = element;
      var optionDel = document.createElement("option")
      optionDel.innerText = element;
      document.getElementById('selectorCat').appendChild(option);
      document.getElementById('selectorCatDel').appendChild(optionDel);

    })
  })
}

function delCat(){
  var itemDeleted;
  var itemToDel = document.getElementById('selectorCatDel').value;
  chrome.storage.sync.get("Mcategories", (data)=>{
    var cats = Object.values(data)[0];
    console.log(cats)
    itemDeleted = cats.filter(function (ele){
      return ele != itemToDel;
    })
    chrome.storage.sync.set({'Mcategories':itemDeleted},upCats);
  })
}
