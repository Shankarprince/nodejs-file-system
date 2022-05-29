const express = require("express");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const app = express();
dotenv.config();


// dotenv configured to deploy in heroku
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Connection established!!!")
});

const data = 
`<div>
    <h1>Hi</h1>
    <p>Welcome to File System</p>
    <p><b> To create a new file in a particular folder : </b> localhost:9001/create </p>
    <p><b> To retrieve all text files in that particular folder : </b> localhost:9001/getfiles </p>
</div>`;

// This is the home address to show the above content in browser.
app.get("/", (request, response) => {
    response.send(data);
})


let timeStamp = Date.now();

// This will create a new file in local file system.
app.get("/create", (request, response) => {
    if(fs.existsSync("./newfolder")){
        fs.writeFile(`./newfolder/${timeStamp.toString()}.txt`, timeStamp.toString(), "utf-8", (err) => {
            if(err) {
                console.log("Error in creating a file in newfolder ", err);
                response.send("Error occurred")
            }
            else {
                response.send("New Text File created successfully in newfolder.")
            }    
        })
    }
    else{
        fs.promises.mkdir("./newfolder", {}).then(() => {
            fs.writeFile(`./newfolder/${timeStamp.toString()}.txt`, timeStamp.toString(), "utf-8", (err) => {
                if(err) {
                    console.log("Error in creating file ", err);
                    response.send("Error occurred")
                }
                else {
                    response.send("New Text File created successfully after creating newfolder.")
                }
            })
        }).catch( (err) => {
            console.log("Error in creating folder : ", err)
            response.send("Error occurred")
        })
    }
    
})

// This will list all the files created in local file system.
app.get("/getfiles", (request, response) => {
    fs.readdir("./newfolder", (err, files) => {        
        if(err){
            response.send("Error occurred")
        }
        else {
            console.log(files);
            const targetFiles = files.filter( file => {
                return path.extname(file) === ".txt";
            })
            console.log(targetFiles);
            response.send(targetFiles);
        }
    })
})