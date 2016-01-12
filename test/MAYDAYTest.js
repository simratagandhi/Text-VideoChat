

suite('usercases test', function() {
var expect = require('expect.js');
var app = require('../app.js');
var welcome = require('../routes/welcome.js');
var headless = require('../routes/headless.js');
//var request = require('supertest');
var sqlite3 = require('sqlite3').verbose();
var file = 'mayday.db';
var DB = new sqlite3.Database('mayday.db');
var request = require('superagent');

//var should = require('should');


    // test: user login 
	test('1.Login', function(done) {
	    request
	      .get('/users')
	      .end(function(err, res) {
            expect(200);
            expect('Content-Type', /json/);
            expect('{"message":"Fetched User List!","users":"global.users"}');
            done();
        });
      });
   //test: user update status
    test('2.update status', function(done) {
	    request
	      .post('/updateStatus')
	      .send({"uid":"keert","status":1,"time":"2015-10-21 15:22"})
	      
	      .end(function(err, res) {
            expect(200);
            expect('Content-Type', /json/);
            expect('{"message":"Status updated!"}');
            expect('{"uid":"keert","status":"1","time":"2015-10-21 15:22"}');
            done();
        });
      });
/* 
	test('post request to /announcement', function(done) {
	    request(app)
	      .post('/announcement')
	      .send({"uid":"keert","annon":"welcome to testing world"})
	      .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            console.log("\nIn test..."+JSON.stringify(res));
            done();
        });
      });

	test('post request to /getHistory', function(done) {
	    request(app)
	      .post('/announcement')
	      .expect(200)
	      .expect('Content-Type', /json/)
	      .end(function(err, res) {
          console.log("\nIn test..."+JSON.stringify(res));
	        done();
	      });
	  });



    // test : should be able to send private messages
    test('send Private Message', function (done) {
        request(app)
            .post('/private chat message')
            .send({"data": "this is private message"})
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(data){
                console.log("data: " + JSON.stringify(data));
                done();
            });
    });
        // test : should be able to get private chat messages
    test('get Private Chat Message', function (done) {
        request(app)
            .post('/getPrivateChat')
            .send({"data": "this is private message"})
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(data){
                console.log("data: " + JSON.stringify(data));
                done();
            });
    });*/
    //msg,sender,receiver,msg_type
    test('3.post Private Chat Message', function (done) {
         request
          .post('/privatemessage')
          .set('Content-Type', 'application/json')
          .send({ msg: 'hello test', sender: 'keert', receiver:'sim', msg_type: 'videochat_request_accept'})
          .end(function(err,res){
            expect('Content-Type', /json/);
            expect(201);
            expect('{"sender":"keert","receiver":"sim","msg":"hello test","msg_type":"videochat_request_accept"}');
            expect('{"message":"Message posted!"}');
            done();
        });
    });

     test('4.get Private Messages', function (done) {
        request
            .get('/privatemessages')
            .send({ sender: 'keert' })
            .send({ reeciver: 'sim' })
            .end(function(err,res){
                expect('Content-Type', /json/);
                expect(201);
                expect('{"message":"Messages retrieved!"}');
              done();
            });
        });

     test('5.search Private Message', function (done) {
        request
            .get('/privateChat')
            .send({ searchTxt: 'video' })
            .end(function(err,res){
                expect('Content-Type', /json/);
                expect(200);
                expect('{"result":"Private Chat", "message":"Prviate message results retrieved!"}');
              done();
            });
        });
     /*test('4.get PrivateChat', function (done) {
      privateChat.getPrivateChat(function(messages){
         expect(messages.length).to.be.above(0);
      });
  

          
              done();
            });*/
       

});
