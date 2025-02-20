var dropdownBtn =  document.querySelector('.dropdown-btn')
var dropdownMenu =  document.querySelector('.dropdown-menu')
var items = document.querySelectorAll('.item')
var selecteditem = document.getElementById('selected-item')

//outside - clicks
window.addEventListener('click',function(){
    closemenu();
})

//event listener for dropdown btn
dropdownBtn.addEventListener('click',e=>{
    e.stopPropagation();
    togglemenu();
})

//event listeners for all the clicks
items.forEach(item => item.addEventListener('click',itemClickHandler));

function togglemenu(){
    dropdownMenu.classList.toggle('open')
}

function closemenu(){
    dropdownMenu.classList.remove('open')
}


function itemClickHandler(e){
    e.stopPropagation();
    selecteditem.innerText = e.target.innerText
    items.forEach((item) => item.classList.remove('active'));

    e.target.classList.add('active')
    closemenu()
}
