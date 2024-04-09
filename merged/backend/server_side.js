const express = require("express");
const path = require('path');
const morgan = require('morgan');
const app = express();
const multer = require('multer');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const fs = require("fs");

const port = 3000;

require('dotenv').config();
//Wendy's

//tell server where to save images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images'); // Destination folder for uploaded files
    },
    filename: function(req, file, cb){ //Rename file
        cb(null, file.originalname);
    }
})

const upload = multer({storage});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//function: upload bg image
//pre conditions: client requests bg image upload
//post conditions: upload image to folder
app.post('/api/upload/bgImg', upload.single('bgImg'), (req, res) => {
    res.send("Picture uploaded successfully (close this tab)");
});

//function: upload pfp
//pre conditions: client requests pfp upload
//post conditions: upload image to folder
app.post('/api/upload/pfp', upload.single('pfp'), (req, res) => {
    res.send("Picture uploaded successfully (close this tab)");
})

//function: handle various client requests
//pre conditions: client specifies which action
//post conditions: perform appropriate action and send response
app.post('/post', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");//give appropriate access
    var queryInfo = JSON.parse(req.query['data']);//parse request data

    //request 1: save bg img
    if(queryInfo['action'] == 'setBgImg'){
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name']){
                        profiles[i].bgSetting = "img";//set bg preference to img
                        profiles[i].bgImg = queryInfo['imgName'];//save bg img file name
                    }
                fileWriter(profiles);//write updated JSON to user data
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client
    //request 2: save bg color
    } else if(queryInfo['action'] == 'setBGColor'){
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name']){
                        profiles[i].bgSetting = "color";//set bg preference to color
                        profiles[i].bgColor = queryInfo['color'];//save bg color
                    }
                fileWriter(profiles);//write updated JSON to user data
                console.log(profiles)
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client

    //request 3: save profile picture
    } else if(queryInfo['action'] == 'setPFP'){
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name'])
                        profiles[i].pfp = queryInfo['imgName'];//save pfp img file
                fileWriter(profiles);//write updated JSON to user data
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client
    
    //request 4: save description
    } else if(queryInfo['action'] == 'setDesc'){
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name'])
                        profiles[i].description = queryInfo['desc'];//save new description
                fileWriter(profiles);//write updated JSON to user data
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client

    //request 5: send user preferences about profile
    } else if(queryInfo['action'] == 'loadSavedContent'){
        var userData = '{"action":"updateProfile", ';//start JSON response

        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++){//find correct user
                    if(profiles[i].username == queryInfo['name']){
                        console.log("sending user data...");

                        //all user profile data
                        userData +=`"bgSetting":"${profiles[i].bgSetting}", `;
                        userData +=`"bgColor":"${profiles[i].bgColor}", `;
                        userData +=`"bgImg":"${profiles[i].bgImg}", `;
                        userData +=`"pfp":"${profiles[i].pfp}", `;
                        userData +=`"description":"${profiles[i].description}", `;
                        userData +=`"textColor":"${profiles[i].textColor}"}`;
                    }
                }
                console.log("user data sent.");
                res.send(userData);
            } catch(err){//handle errors
                console.log(err);
            }
        })
    
    //request 6: save text color
    } else if(queryInfo['action'] == 'setTextColor'){
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name'])
                        profiles[i].textColor = queryInfo['color'];//save text color

                fileWriter(profiles);//write updated JSON to user data
            } catch(err){//handle errors
                console.log(err);
            }
        })
        saved(res);//send saved response to client

    //request 7: check if description has been saved
    } else if(queryInfo['action'] == 'checkIfDescSaved'){
        fs.readFile('./profiles-list.json', 'utf-8', (err, jsonString) => {
            errPrint(err);//handle errors
            try {
                var profiles = JSON.parse(jsonString);//parse user data JSON
                for(var i = 0; i < profiles.length; i++)//find correct user
                    if(profiles[i].username == queryInfo['name'])
                        if(profiles[i].description == queryInfo['newDesc'])//if client description matches server description...
                            res.send(JSON.stringify({//tell client description is saved
                                'action':'descSaved'
                            }))
                        else //if client description does NOT match server description...
                            res.send(JSON.stringify({//tell client descriotion has not been saved
                                'action':'descNotSaved'
                            }))
                
            } catch(err){//handle errors
                console.log(err);
            }
        })
    }
})

//function: generic saved response
//pre conditions: user data has been updated
//post conditions: send client response that data has been saved
saved = (res) => {
    console.log("saved")
    var jsontext = JSON.stringify({
        'action': 'saved'
    })
    res.send(jsontext);
} 

//function: update JSON file
//pre conditions: data has been modified
//post conditions: update database
fileWriter = (profiles) => {
    profiles = JSON.stringify(profiles, null, 2);
        
    fs.writeFile('./profiles-list.json', profiles, err => {
        if(err) {//handle errors
            console.log(err);
        }
    })
}

//function: generic error handler
//pre conditions: an error has occured
//post conditions: log error in console so devs can fix
errPrint = (err) => {
    if(err)
        console.log(err);
}

//Mia's
// Simulated in-memory 'database'
const usersDb = {};

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// User registration
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    if (usersDb[username]) {
      return res.status(400).json({ message: 'Username already exists.' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 8);
    usersDb[username] = { email, password: hashedPassword };
  
    res.json({ message: 'Signup successful.' });
  });

  // User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = usersDb[username];
  
    if (!user) {
      return res.status(400).json({ message: 'User does not exist.' });
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
  
    // Assuming successful login
    req.session.username = username; // Save username in session
    res.json({ message: 'Login successful.' });
  });
  
  // Retrieve current user settings
  app.get('/api/settings', (req, res) => {
    const { username } = req.session;
    
    if (!username || !usersDb[username]) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    const user = usersDb[username];
    res.json({ username, email: user.email });
  });
  
  // Update user settings
  app.post('/api/updateSettings', async (req, res) => {
    const { username } = req.session;
    const { email, password } = req.body;
  
    if (!username || !usersDb[username]) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    if (email) {
      usersDb[username].email = email;
    }
    
    if (password) {
      usersDb[username].password = await bcrypt.hash(password, 8);
    }
  
    res.json({ message: 'Settings updated successfully.' });
  });

//Quynh's
// create a json file
var objStart = {
        table: []
    };

// save the draft post into draftList.json
app.get('/saveDraft', (req, res) => {
    //console.log(req.query);
  
    var postProperty = {
        content : req.query["content"],
        title : req.query["title"],
        public : false
    };
    try {
        fs.readFile('profiles-list.json', "utf8", function readFileCallback(err, data) {
            if (err) {throw err;}
            else {
                objStart = JSON.parse(data); //now it is a list
                //console.log(data);
                objStart[0]["post"] = postProperty; //add some data
                json = JSON.stringify(objStart); //convert it back to json
                fs.writeFile('profiles-list.json', json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('Append "post" profiles-list.json file on server.');
                });    
            } 
        });    
    } catch (err) {
        console.error(err);
    }
    res.setHeader("Access-Control-Allow-Origin", "*") //Allows browser to load return values
    res.json({
        output: "Wrote to a file on the server."
    })
})

app.get('/publishPost', (req, res) => {
    var postProperty = {
        content : req.query["content"],
        title : req.query["title"],
        public : "false"
    };
    try {
        fs.readFile('profiles-list.json', "utf8", function readFileCallback(err, data) {
            if (err) {throw err;}
            else {
                postProperty["public"] = "true";
                objStart = JSON.parse(data); //now it is a list
                objStart[0]["post"] = postProperty; //add some data
                json = JSON.stringify(objStart); //convert it back to json
                fs.writeFile('profiles-list.json', json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('Change public to true');
                });   
            }
            
            if (postProperty["public"] == "true") {
                
            }
        });    
    } catch (err) {
        console.error(err);
    }
    res.setHeader("Access-Control-Allow-Origin", "*") //Allows browser to load return values
    res.json({
        output: "Wrote to a file on the server."
    })
})

//push info into contact.json
app.get('/saveContact', (req, res) => {
    console.log(req.query);

    var obj = {username: req.query["username"],
               email: req.query["email"],
               description: req.query["description"]};

    try { 
        fs.readFile('contactList.json', "utf8", function readFileCallback(err, data) {
            if (err) {throw err;} 
            else {
            objStart = JSON.parse(data); //now it an object
            objStart.table.push(obj); //add some data
            json = JSON.stringify(objStart); //convert it back to json
            fs.writeFile('contactList.json', json, 'utf8', function (err) {
                if (err) throw err;
                console.log('Append to a json file on server.');
            });    
        } 
            }
        );}
    catch (err) {
        console.error(err);
    }
    res.setHeader("Access-Control-Allow-Origin", "*") //Allows browser to load return values
    res.json({
        output: "Wrote to a file on the server."
    })
})

app.listen(port, function() {
    console.log(`Listening on port ${port}`)
})
