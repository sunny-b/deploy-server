var express = require("express");
var app = express();
var childProcess = require('child_process');
var githubUsername = 'sunny-b';
var githubBranch = 'master';
var deployPath = 'cd /home/sunny && sudo ./deploy.sh';

app.use(express.json());

app.post("/webhooks/github", function (req, res) {
    var sender = req.body.sender;
    var branch = req.body.ref;

    if (isProperTrigger(sender, branch)) {
        deploy(res);
    }
})

function isProperTrigger(sender, branch) {
  return branch.indexOf(githubBranch) > -1 && sender.login === githubUsername;
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
