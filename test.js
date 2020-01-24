'use strict'
var express = require('express');
var path = require('path');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var randomstring = require('randomstring')
var dbConn = mongodb.MongoClient.connect('mongodb://heroku_n3nz65q4:tgff2r4unrc84hkrm8j5pb9fea@ds259207.mlab.com:59207/heroku_n3nz65q4', { useUnifiedTopology: true });
const sgMail = require('@sendgrid/mail');
var math = require('math')
sgMail.setApiKey('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');
//console.log('thats why they call me slim shady');

var ejs = require('ejs');
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.get('/', function(req, res) {
    res.render('pages/index', {

    })

})
app.post('/login', function(req, res) {
    //console.log(req.body)
    dbConn.then(function(db) {
        var dbo = db.db("heroku_n3nz65q4")
        dbo.collection("User").find({ User: req.body.username }).toArray(function(err, result) {

            if (result.length !== 0) {
                if (req.body.password == result[0].Password) {
                    res.render('pages/make', {
                        user: req.body.username
                    })
                }
                if (req.body.password !== result[0].Password) {
                    res.send('wrong')
                }
            }
            if (result.length == 0) {
                res.send('invalid user')
            }
        });
    });
});
app.post('/submit', function(req, res) {
    dbConn.then(function(db) {
        var dataRecd = req.body;
        var teamID = randomstring.generate({
            length: 12,
            charset: 'alphabetic'
        });
        dataRecd['teamID'] = 'EQ20' + teamID
        dataRecd['referral'] = 'Self'
        var dbo = db.db("heroku_n3nz65q4")
        dbo.collection('registration').insertOne(dataRecd);
        dbo.collection('registration-team').insertOne(dataRecd);
        /*  var msg = {
              to: [req.body.clemail, 'rahul.batra.2019@sse.ac.in'],
              from: 'no-reply@eq20.in',
              subject: 'Registration and Payment has been successful',
              dynamic_template_data: {

                  firstName: req.body.clname,
                  refferal: req.body.ref,
                  teamID: dataRecd['teamID'],
                  Paid: req.username


              },

              templateId: '', //to-do
              text: 'and easy to do anywhere, even with Node.js',
              html: 'nothing needed',
          };

          sgMail.send(msg); */
        res.send('recd')
    })
})

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');