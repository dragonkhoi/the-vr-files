function openDropdown(){
  document.getElementById("dropdownList").classList.toggle("show");
}

window.onclick = function(event){
  if(!event.target.matches('#dropdownButton')){
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
