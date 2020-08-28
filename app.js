const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.static("public1"));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address:email,
                status:"subscribed",
                merge_fields: {
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/c2d3fdf31a";
    const options = {
        method:"POST",
        auth: "K@rt1kay:465b6db5716be9d03c747bcfcfa142c7-us18"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/index.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });
    
    request.write(jsonData);
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
})


app.listen(3000,function(){
    console.log("App Started");
})


