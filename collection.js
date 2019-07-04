var allKeys,allNotes;

upDateTable();
memoryDisplay();

function upDateTable(){

  //clean table
  var range = document.createRange();
  range.selectNodeContents(document.getElementById('tableContent'));
  range.deleteContents();

//get all keys to import objcts in a list
  chrome.storage.sync.get(null, function(items) {
       allKeys = Object.keys(items);
       allNotes = Object.values(items);

      if (items.Mcategories){
        allNotes.shift();
        allKeys.shift();
      }

  //chrome.storage.sync.clear();
      allNotes.forEach(function(element, index){
        var newTR = document.createElement('tr');
        let date = allNotes[index].date
        newTR.className = 'table-active';
        newTR.innerHTML =
          '<td>'+date[0]+' - '+date[1]+'/'+date[2]+'/'+date[3]+'</td>'+
          '<td>'+allNotes[index].root+'</td>'+
          '<td>'+allNotes[index].titlePage+'</td>'+
          '<td>'+allNotes[index].category+'</td>'+
          '<td>'+allNotes[index].note+'</td>'+
          '<td><button type="button" class="btn btn-outline-info" id="open'+index+'">open</button></td>'+
          '<td><button type="button" class="btn btn-outline-danger"id="del'+index+'">delete</button></td>';
        document.getElementById('tableContent').appendChild(newTR)
        document.getElementById("open"+index).addEventListener('click',()=>{
          window.open(allKeys[index],'_blank');
          upAll();
        })
        document.getElementById("del"+index).addEventListener('click',()=>{
          chrome.storage.sync.remove(allKeys[index]);
          upAll();
        })
      })
  });
}

function upAll(){
  upDateTable();
  memoryDisplay();
}

function memoryDisplay(){
chrome.storage.sync.getBytesInUse(null, function(bytesInUse){
  var bytesUsed = (bytesInUse);
  var mbUsed = bytesUsed / 1000000;
  document.getElementById('mInUse').innerHTML = mbUsed +'mb';
  document.getElementById('progressBar').style.width = mbUsed+"%";
  console.log(allKeys.length)
  document.getElementById('howMuchSaved').innerText = "You have "+allKeys.length+" insights saved locale."
});
}
