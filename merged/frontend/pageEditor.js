var url="https://kit.fontawesome.com/2a5e0b1595.js";

function loadScript() {    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.crossOrigin = "anonymous";
    head.appendChild(script);
}
function bold() {
    document.getElementById("textarea1").style.fontWeight = "bold"; 
}
function leftAlign(){
    document.getElementById("textarea1").style.textAlign = "left";
}
function centerAlign(){
    document.getElementById("textarea1").style.textAlign = "center";
}
function rightAlign(){
    document.getElementById("textarea1").style.textAlign = "right";
}
function justifyAlign() {
    document.getElementById("textarea1").style.textAlign = "justify";
    document.getElementById("textarea1").style.textJustify = "inter-word";
}
function italic() {
    document.getElementById("textarea1").style.fontStyle = "italic";
}
function underline() {
    document.getElementById("textarea1").style.textDecoration = "underline";
}
function dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  // Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
if (!event.target.matches('.btnFontChange')) {
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

function times() {
    document.getElementById("textarea1").style.fontFamily = "Times New Roman";
}
function georgia() {
    document.getElementById("textarea1").style.fontFamily = "Georgia";
}
function garamond() {
    document.getElementById("textarea1").style.fontFamily = "Garamond";
}
function arial() {
    document.getElementById("textarea1").style.fontFamily = "Arial";
}

function save() {
    var text={content: document.getElementById("textarea1").value,
              title: document.getElementById("title").value};
    //text["content"] = "a";
    //document.getElementById("abc").innerHTML = text["content"];
    //text["content"] = document.getElementById("textarea1").innerHTML;
    
    $.getJSON("http://localhost:3000/saveDraft", text, function(data) {
        alert("Your post has been saved.")
    })
}

function publish() {
    var text={content: document.getElementById("textarea1").value,
              title: document.getElementById("title").value};
    
    save();

    $.getJSON("http://localhost:3000/publishPost", text, function(data) {
        alert("Your post has been published.")
    })

}

