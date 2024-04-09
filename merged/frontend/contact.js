function submit() {
    var info = {};
    info["username"] = document.getElementById("username").value + "\n";
    info["email"] = document.getElementById("email").value + "\n";
    info["description"] = document.getElementById("desc").value + "\n";

    $.getJSON("http://localhost:3000/saveContact", info, function(data) {
        document.getElementById("thanks").innerHTML = "Your contact request has been sent. Thank You!";
})
}