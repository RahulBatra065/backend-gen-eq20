'use strict'
var express = require('express');
var path = require('path');
var newrelic = require('newrelic');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var randomstring = require('randomstring')
var dbConn = mongodb.MongoClient.connect('process.env.MONGODB_URI', { useUnifiedTopology: true });
const sgMail = require('@sendgrid/mail');
//var math = require('math')
sgMail.setApiKey('process.env.SENDGRID_ID');
//console.log('thats why they call me slim shady');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var ejs = require('ejs');
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', function(req, res) {
    res.render('pages/index', {

    })

})
app.post('/login', function(req, res) {
    //console.log(req.body)
    dbConn.then(function(db) {
        var dbo = db.db("")
        dbo.collection("User").find({ User: req.body.username }).toArray(function(err, result) {
            console.log(result)
            if (result.length !== 0) {
                bcrypt.compare(req.body.password, result[0].Password, function(err, result1) {
                   
                    if (result1 == true) {
                        res.render('pages/make', {
                            user: req.body.username,
                            name: result[0].name
                        })

                    }
                    if (result1 == false) {
                        res.send('incorrect password please try again :)')
                    }

                });


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
            var A;
            let time = (A) => {
                var d = Date();
                A = d.toString();

                dataRecd['pay'] = "yes to reg team member on" + A;
            }
            time();
            dataRecd['teamID'] = 'EQ20' + teamID
            dataRecd['referral'] = 'Self'
            var dbo = db.db("")
            dbo.collection('registration').insertOne(dataRecd);
            dbo.collection('registration-team').insertOne(dataRecd);
            //console.log(dataRecd)
            var msg = {
                to: ['rahul.batra.2019@sse.ac.in', req.body.emailid],
                from: 'no-reply@eq20.in',
                subject: 'Registration and Payment has been successful',
                dynamic_template_data: {

                    firstName: req.body.name,
                    teamID: dataRecd['teamID'],
                    regTeam: req.body.username,
                    emailID: req.body.emailid


                },

                templateId: 'd-ed0d3a41d88f4eacb1a375e8a21358c9',
                text: 'and easy to do anywhere, even with Node.js',
                html: 'nothing needed',
            };

            sgMail.send(msg);
            res.send('recd')
        })
    })
    /*app.get('/create', function(req, res) {
        res.render('pages/create')
    })
    app.post('/createUser', function(req, res) {
        var dataCombo = req.body
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.Password, salt, function(err, hash) {
                dataCombo['Password'] = hash
                dbConn.then(function(db) {
                    var dbo = db.db("heroku_n3nz65q4")
                    dbo.collection('User').insertOne(dataCombo);
                })
            });
        });
        res.send('Please make not of your id\n' + ' ' + req.body.User + "and password\n" + req.body.Password)
        console.log(dataCombo)

    })
    app.get('/logout', function(req, res) {
        res.render('pages/logout')
    })
    */
app.use(function(req, res, next) {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    res.status(404 || 401 || 504 || 304 || 101 || 404);

    res.format({
        html: function() {
            res.render('pages/index.ejs', {
                ip: ip
            })
        },
        json: function() {
            res.json({ error: 'Not found' })
        },
        default: function() {
            res.type('txt').send('Not found')
        }
    })

});
app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');