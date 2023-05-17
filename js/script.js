import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { 
  getDatabase, 
  ref, 
  push, 
  onValue,
  remove
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

const appSettings = {
  databaseURL: 'https://playground-097-default-rtdb.asia-southeast1.firebasedatabase.app/'
}

const app = initializeApp(appSettings)
const database = getDatabase(app);
const shoppingListDB = ref(database, "shoppingList")

const el = document.getElementById('input-field');
const buttonEl = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');
const warningText = document.getElementById('warning');


//update shopping list on change of real time database
onValue(shoppingListDB, (snapshot) => {

  clearShoppingListEl();

  if(snapshot.exists()){
    let shoppingListItemsInDB = Object.entries(snapshot.val());
    
    showInDOM(shoppingListEl);
    hideFromDOM(warningText);
  
    shoppingListItemsInDB.forEach( singleItem => {
      addItemToShoppingListEl(singleItem);
    });

  }else{

    hideFromDOM(shoppingListEl);
    showInDOM(warningText);
 
  }

})


//on add item button action
buttonEl.addEventListener('click', (e) => {

  let inputValue = el.value.trim();

  if(inputValue){
    push(shoppingListDB, inputValue);
    clearInputFieldEl()
  }else{
    alert('Invalid iitem. Input valid item')
  }

}) 


//append a single shopping item into the list
function addItemToShoppingListEl([itemId, itemName]){

  let listItem = document.createElement('li');
  listItem.textContent = itemName;

  //remove item on double click
  listItem.addEventListener('dblclick', () => {
    let locationOfListItemInDB = ref(database, `/shoppingList/${itemId}`)
    remove(locationOfListItemInDB);
  })

  shoppingListEl.append(listItem);
}


//clear input field
function clearInputFieldEl(){
  el.value = '';
}


//clear shoppingList
function clearShoppingListEl(){
  shoppingListEl.innerHTML = '';
}

//hide Element from DOM 
function hideFromDOM(el){
  el.style.display = 'none'
}

//makes the element visible in DOM
function showInDOM(el){
  let displayValue;
  if(el===shoppingListEl){
    displayValue = 'flex'
  }else if(el===warningText){
    displayValue = 'block'
  }else{
    displayValue = 'initial';
  }
  el.style.display = displayValue;
}
