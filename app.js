require('dotenv').config()

var https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json({
    type: 'application/json'
}));

//http://localhost:3000/pool/create?key=374609c6&secret=330ef6e8837b1b5f&pool_id=Adidas_test_pool

app.all('/pool/create', (req, resp) => {
    if (req.query.key && req.query.secret) {
        var params = {
            account_id: req.query.key,
            pool_id: req.query.pool_id || Math.random(),
            localised_sender_preferred: req.query.localised_sender_preferred || false,
            fallback: req.query.fallback || "Pool",
            predictable_sender_preferred: req.query.predictable_sender_preferred || true
        }

        var options = {
            uri: "https://api.nexmo.com/v1/pools",
            method: 'POST',
            json: params,
            headers: {
                Authorization: "Api-Key " + req.query.key + " " + req.query.secret,
                "Content-Type": "application/json"
            }
        };

        console.log("params: ", req.query);
        request(options, (err, res, body) => {
            if (err) {
                console.log(err);
                return resp.sendStatus(400);
            }

            console.log(body.url);
            console.log(body.explanation);
            console.log(res)
            return resp.sendStatus(200);
        });



    } else {
        resp.sendStatus(400);
    }
});

// Start server
app.listen(port, () => {
    console.log('Express server started on port ' + port);
})