var express = require("express");
var app = express();
var childProcess = require('child_process');
var githubUsername = 'sunny-b';
var githubBranch = 'master';
var deployPath = 'cd /home/sunny && sudo ./deploy.sh';

app.use(express.bodyParser());

app.post("/webhooks/github", function (req, res) {
    console.log(req.body)
    var sender = req.body.sender;
    var branch = req.body.ref;

    if (isProperTrigger(sender, branch)) {
        deploy(res);
    }
})

function isProperTrigger(sender, branch) {
  return branch.indexOf(branch) > -1 && sender.login === username;
}

function deploy(res) {
  childProcess.exec(deployPath, function(err, stdout, stderr) {
    if (err) {
      console.error(err);
      return res.send(500);
    }
    res.send(200);
  });
}

module.exports = app;
