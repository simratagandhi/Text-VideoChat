///**
// * Mocha Test Restful API.
// */
//var app = require('../app.js');
//var users = require('../routes/users.js');
//var welcome = require('../routes/welcome.js');
//var request = require('supertest');
//var sqlite3 = require('sqlite3').verbose();
//var file = 'mayday.db';
//var headless = require('../routes/headless.js');
//var assert = require('assert');
//
//// creat a connection with the db,
////before(function(done)){
////    sqlite3.connect(config.db.sqlite3);
////    done();
////};
////users : fetched user list  test
//it('test: users : fetched user list', function() {
//    request(headless)
//        .get('/users')
//        .send()
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//
//});
//// logout user test
//it('test: logout user', function() {
//    request(headless)
//        .get('/logout/:users')
//        .send()
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//
//});
//
//// user: fetched a single user  test
//it('test: user : fetched a single user test', function() {
//    var params = {
//        user: 'user34'
//    };
//    request(headless)
//        .get('/logout/:users')
//        .send(params)
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.params.user, 'user34');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//
//});
//
////updateuser test
//it('test: updateUser', function() {
//    var body = {
//        columnId: '3',
//        value: '1',
//        uid: 'user34'
//
//    };
//
//    request(headless)
//        .post('/updateUser')
//        .send(body)
//        .expect(201)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.body.columnId, '3');
//            assert.equal(res.body.value, '1');
//            assert.equal(res.body.uid, 'user34');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//
//});
//
////publicmessage test
//it('test: publicmessage', function() {
//    var body = {
//        user: 'user34',
//        content: 'publicmsgtest'
//
//    };
//    request(headless)
//        .post('/publicmessage')
//        .send(body)
//        .expect(201)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            //if (err) return done(err);
//            assert.equal(res.body.user, 'user34');
//            assert.equal(res.body.content, 'publicmsgtest');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//
//});
//
//
////messagewall test
//
//it('test: message wall', function() {
//    //var body = {
//    //    user: 'user34',
//    //    content: 'publicmsgtest'
//    //
//    //};
//    request(headless)
//        .get('/message/wall')
//        //.send(body)
//        .send()
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//
//});
//
////privatemessage test
//it('test: privatemessage', function() {
//    var body = {
//        sender: 'user34',
//        receiver: 'user23',
//        msg: 'privatemsgtest'
//
//    };
//    request(headless)
//        .post('/privatemessage')
//        .send(body)
//        .expect(201)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.body.sender, 'user34');
//            assert.equal(res.body.receiver, 'user23');
//            assert.equal(res.body.content, 'privatemsgtest');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//
//});
//
////privatemessages sender receiver test
//it('test: private messages sender and receiver', function() {
//    var body = {
//        sender: 'user34',
//        receiver: 'user23'
//
//    };
//    request(headless)
//        .post('/privatemessages/:sender/:receiver')
//        .send(body)
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.body.sender, 'user34');
//            assert.equal(res.body.receiver, 'user23');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//
//});
//
////chatbuddies test
//
//it('test: chatbuddies', function() {
//    var params = {
//        user: 'user34'
//    };
//    request(headless)
//        .get('/chatbuddies/:user')
//        .send(params)
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.params.user, 'user34');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//});
//
////getmessage test
//it('test: getmessage with id', function() {
//    var params = {
//        id: 'user34'
//    };
//    request(headless)
//        .get('/getmessage/:id')
//        .send(params)
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.params.id, 'user34');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//});
//
////status test
//it('test: status of user', function() {
//    var body = {
//        status: 1,
//        location: 'CA',
//        timestamp: '2015-10-21 15:22'
//    };
//    var params = {
//        uid: 'user34'
//    };
//    request(headless)
//        .post('/status/:user')
//        .send(body)
//        //.expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.body.status, 1);
//            assert.equal(res.body.location, 'CA');
//            assert.equal(res.body.timestamp, '2015-10-21 15:22');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//});
//
//// store announcement test
//it('test: store announcement', function() {
//    var body = {
//        annon: 'ok',
//        uid: 'user34'
//    };
//    request(headless)
//        .get('/storeAnnouncement')
//        .send(body)
//        //.expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.body.uid, 'user34');
//            assert.equal(res.body.annon, 'ok');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//});
//
////  announcement test
//it('test:  announcement', function() {
//    request(headless)
//        .get('/announcement')
//        .send()
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//});
//
//// search public chat test
//it('test: public chat search text ', function() {
//    var body = {
//        searchTxt: 'hello'
//    };
//    request(headless)
//        .get('/publicChat/:searchTxt')
//        .send(body)
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.body.searchTxt, 'hello');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//});
//// search private chat test
//it('test: private chat search text ', function() {
//    var params = {
//        searchTxt: 'hello'
//    };
//    request(headless)
//        .get('/privateChat/:searchTxt')
//        .send(params)
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.params.searchTxt, 'hello');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//});
//// search name chat test
//it('test: username on chat search  ', function() {
//    var params = {
//        searchTxt: 'user34'
//    };
//    request(headless)
//        .get('/cName/:searchTxt')
//        .send(params)
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.params.searchTxt, 'user34');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//});
//
//// search status for online users test
//it('test: search status for online users  ', function() {
//    var params = {
//        searchTxt: 'user34'
//    };
//    request(headless)
//        .get('/cName/:searchTxt')
//        .send(params)
//        //.expect(404)
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.params.searchTxt, 'user34');
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//});
//
//// search announcements  test
//it('test: search announcements  ', function() {
//    var params = {
//        searchTxt: 1
//    };
//    request(headless)
//        .get('/announcements/:searchTxt')
//        .send(params)
//        //.expect(404)
//        .expect(200)
//        .expect('Content-Type',/json/)
//        .end(function(err,res){
//            if (err) return done(err);
//            assert.equal(res.params.searchTxt, 1);
//            console.log("\nIn test..."+JSON.stringify(res));
//            done();
//        })
//});