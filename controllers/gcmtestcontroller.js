var express = require("express");
var router = express.Router();
var path = require("path");
var bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
var request = require("request");

router.get("/", function (req, res) {
    res.sendFile(path.resolve("index.html"));
});

router.post("/", function (req, res) {
    var body;

    if (typeof req.body.announcement !== "undefined") body = JSON.stringify({condition: "'household_" + req.body.topic_id + "' in topics", priority: "high", data:{fromId: req.body.from_id, announcement: req.body.announcement}});
    else if(typeof req.body.task_id !== "undefined") body = JSON.stringify({condition: "'household_" + req.body.topic_id + "' in topics", data:{taskFinished: req.body.task_id, userFinished: req.body.user_id}});

    var options = {
        url: "https://fcm.googleapis.com/fcm/send",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "key=AAAADThleZQ:APA91bGw5-Al9JrL7lY2QUOJYNjVUkZu1OnM15Y5NP-fzwYmhL0kVi6cO5tdJtyJg0vrdbdrWDLC7ELvWF0vL7UtVWIGpspZiCiHE68viwiWkCFaKyvE77Up-QCb026rr6VEFeU90Y2Z2Pvm7ajz-5Xi5Ov33bPVKA",
        },
        body: body
    };

    request(options, function (error, response, body) {
        var JSONBody = JSON.parse(body);

        if (typeof JSONBody.message_id !== "undefined" && typeof JSONBody.error === "undefined") res.sendFile(path.resolve("success.html"));
        else res.sendFile(path.resolve("failed.html"));
    });
});

module.exports = router;