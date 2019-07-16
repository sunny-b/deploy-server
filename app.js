var express = require("express");
var crypto = require("crypto")
var bcrypt = require("bcrypt")

var app = express();
var childProcess = require('child_process');
var githubUsername = 'sunny-b';
var githubBranch = 'master';
var deployPath = 'cd /home/sunny && ./deploy.sh';
var secret = process.env.WEBHOOK_SECRET;

app.use(express.json());

app.post("/webhooks/github", function (req, res) {
  console.log("Received GitHub Webhook");
  console.log(JSON.stringify(req.body));

  if (!isProperTrigger(req)) {
    console.error("invalid webhook");
    return res.sendStatus(400);
  }

  console.log("Deploying new Docker instance");

  deploy(res);

  console.log("Webhook completed successfully");
})

function isProperTrigger(req) {
  var sig = "sha1=" + crypto.createHmac('sha1', secret).update(JSON.stringify(req.body)).digest('hex');

  return bcrypt.compareSync(req.headers['x-hub-signature'], sig);
}

function deploy(res) {
  childProcess.exec(deployPath, function(err, stdout, stderr) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    res.sendStatus(200);
  });
}

module.exports = app;
