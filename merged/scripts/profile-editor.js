var url = "http://localhost:3000/post";//server url

const documentPath =  window.location.href;//get url of page we're working with

//figuring out which user we're working with
const documentUser = documentPath.substring(
    documentPath.lastIndexOf("users/") + 6, 
    documentPath.lastIndexOf("/")
);


var user = documentUser;
var loggedIn = 'test'
// loggedIn = 'test';

console.log(localStorage.getItem("loggedIn"))

logOut = () => {
    loggedIn = null;
    console.log("logged out");
    localStorage.setItem("loggedIn", loggedIn)
}

//function: variety of functions for DOM loads
//pre conditions: page has been refreshed
//post conditions: tasks listed below...
document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem("loggedIn", loggedIn)
    //task 1: ensure user does not edit other people's profiles
    if(documentPath.indexOf("profile-editor.html") != -1 && (loggedIn == null || user != loggedIn)){
        console.log("Access denied.");
        window.location.href = documentPath.substring(0, documentPath.lastIndexOf('/') + 1) + "profile.html";
    }
    //task 2: send request to refresh styles & images to server
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'loadSavedContent'
    }),response);

    //task 3: if the user has edited description but has not saved, display the status to the user
    if(documentPath.indexOf("editor") != -1){ //see if we're in the profile editor or just the profile display
        document.getElementById("description").addEventListener("input", () => { //send request to check with backend database
            $.post(url+'?data='+JSON.stringify({
                'name':user,
                'action':'checkIfDescSaved',
                'newDesc':document.getElementById("description").value
            }), response);
        })
    }

    // if(loggedIn == null){
    //     document.getElementById("my-profile").;

    // }
});

// function: change current page background color & send request to update user preferences
//pre conditions: user has updated background color
//post conditions: update background color & send to server to save preference
saveBGColor = () => {
    const bg = document.getElementById("profile"); //get background element
    bg.style.backgroundImage = null; //make sure background image does not display
    var color = document.getElementById("color-picker").value + "";//retrieve color
    bg.style.backgroundColor = color;//set color background

    //send request to server to save the new color background
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setBGColor',
        'color':color.substring(1,color.length)
    }),response);
}

//function: change & save text color
//pre conditions: user has set a new color value
//post conditions: update text color & send to server to save info
saveTextColor = () => {
    const color = document.getElementById("text-color-picker").value + "";//retrieve new color from client
    const hex = color.substring(1, color.length);//save data in format that will not mess up JSON
    changeTextColor(hex);//call function to change all applicable text color

    //send request to server to save text color
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setTextColor',
        'color':hex
    }),response);
}

//function: change & save background image
//pre conditions: user has set a new background image
//post conditions: change background image & send request to server to save the background preference
setBgImg = () => {
    const bg = document.getElementById("profile");//get background element
    bg.style.backgroundColor = null;//make sure background color does not display

    //get image name & change to proper format
    var fileName = document.getElementById('bgImg').value + "";
    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
    //set background image
    bg.style.backgroundImage = `url("images/${fileName}")`;

    //send request to server to save background image
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setBgImg',
        'imgName':fileName
    }),response);
}

//function: change & save profile picture 
//pre conditions: user has updated profile picture file
//post conditions: change profile picture & send request to server to save profile picture
setPFP = () => {
    const pfp = document.getElementById("profile-picture");//get profile picture element

    //get new profile picture file & change to proper format
    var fileName = document.getElementById('pfp').value + "";
    fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);

    //set new profile picture
    pfp.src = `images/${fileName}`;

    //send request to server to save profile picture
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setPFP',
        'imgName':fileName
    }),response);
}

//function: clear profile picture & save preference
//pre conditions: user has clicked 'clear profile picture' button
//post conditions: change profile picture to default image & send request to server to save pfp preference
clearPFP = () => {
    const pfp = document.getElementById("profile-picture");//get profile picture element
    pfp.src = `images/default.jpg`;//change element to default

    //send request to save profile picture preference
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setPFP',
        'imgName':'default.jpg'
    }),response);
}

//function: save description
//pre conditions: user has pressed 'save' for description box
//post conditions: send request to server to save new description
saveDesc = () => {
    //send request to server to save new description
    $.post(url+'?data='+JSON.stringify({
        'name':user,
        'action':'setDesc',
        'desc':document.getElementById("description").value
    }),response);
}

//function: change text color
//pre conditions: text color
//post conditions: all relevent text & element colors are updated
changeTextColor = (hex) => {
    const colorCode = "#" + hex;//change hex parameter to proper format

    //get & set all relevent text elements
    const stats = document.getElementById("stats").getElementsByTagName("h3");
    for(var i = 0; i < stats.length; i++){
        stats[i].style.color = colorCode;
    }
    document.getElementById("description").style.color = colorCode;
    document.getElementById("username").style.color = colorCode;
    document.getElementById("line").style.borderColor = colorCode;
    
    //if in editor mode, do not change description color
    if(documentPath.indexOf("profile-editor.html") != -1)
        document.getElementById("description").style.color = "#000000";
    
}

//function: recieve response from server & do appropriate action
//pre conditions: server has sent a response
//post conditions: client performs appropriate action
function response(data, status){

    var response = JSON.parse(data);//parse data from server

    //response 1: indicate user preferences have been saved
    if(response['action'] == 'saved')
        console.log("saved");

    //response 2: update user info
    else if(response['action'] == 'updateProfile'){
        console.log("Updated styles");

        if(loggedIn != 'null' && loggedIn != null){
            console.log(loggedIn != null + "" + loggedIn)
            if(documentPath.indexOf("profile-editor.html") == -1){//update nav bar to say logged in user's username if we're not in profile editor
                document.getElementById("my-profile").style.display = "default";
                document.getElementById("my-profile").innerHTML = `${loggedIn}'s profile`;
                // console.log(loggedIn)
                document.getElementById("my-profile").href = documentPath.substring(0, documentPath.lastIndexOf("users/") + 6) + `${loggedIn}/profile-editor.html`
            } else {
                document.getElementById("my-profile").style.display = "default";
                document.getElementById("my-profile").href = documentPath.substring(0, documentPath.lastIndexOf("users/") + 6) + `${loggedIn}/profile.html`
            }
            document.getElementById("login-logout").innerHTML = "Log out";
            // document.getElementById("login-logout").href = "";
            document.getElementById("login-logout").onclick = logOut;
            document.getElementById("account-settings").style.display = "default";
            console.log(loggedIn)
        } else {
            console.log("hello")
            document.getElementById("my-profile").style.display = "none";
            document.getElementById("account-settings").style.display = "none";
            document.getElementById("login-logout").innerHTML = "Log in";
            // document.getElementById("login-logout").href = "";
            document.getElementById("login-logout").onclick = null;
        }

        document.getElementById("username").innerHTML = "@" + user;//ensure username is display appropriate user
        document.getElementById("description").value = response['description'];//update description for profile editor
        document.getElementById("description").innerHTML = response['description'];//update description for profile display
        changeTextColor(response["textColor"]);//call function to change text color
        document.getElementById("profile-picture").src = "../../images/"+response['pfp'];//update profile picture

        //background settings
        if(response['bgSetting'] == 'color'){//color
            document.getElementById("profile").style.backgroundImage = null;//ensure we don't display image
            document.getElementById("profile").style.backgroundColor = "#" + response['bgColor'];//update bg color
        } else {//image
            document.getElementById("profile").style.backgroundColor = null;//ensure we don't display color
            document.getElementById("profile").style.backgroundImage = `url("../../images/${response['bgImg']}")`;//update bg img
        }
    //response 3: description has been saved
    } else if(response['action'] == 'descSaved'){
        document.getElementById("descSaveStatus").innerHTML = "Status: Saved"
        document.getElementById("descSaveStatus").style.color = "green";
    //response 4: description has not been saved
    } else if(response['action'] == 'descNotSaved'){
        document.getElementById("descSaveStatus").innerHTML = "Status: Not saved"
        document.getElementById("descSaveStatus").style.color = "red";
    }
}