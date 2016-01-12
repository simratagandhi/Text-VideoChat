

    $('[data-toggle=offcanvas]').click(function() {
    $(this).toggleClass('visible-xs text-center');
    $(this).find('i').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
    $('.row-offcanvas').toggleClass('active');
    $('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
    $('#xs-menu').toggleClass('visible-xs').toggleClass('hidden-xs');
    $('#chatPage').toggleClass('col-xs-10').toggleClass('col-xs-8');
    $('#btnShow').toggle();
});

    //Socket io script  
    var socket = io.connect('http://'+window.location.hostname+':5000');

    // var colorStack = {};;

    socket.on('chat message', function(data) {
    var path =  $("#topNav ul li.active").attr('data-path');
    if(path.indexOf('privatechat') == -1){
      if(signInMsg < data.msgid){
        if (lastMsgUid != "" && lastMsgUid == data.uid) {
            $('#messages div').last().first().append('<span class="msg cmsg">' + decodeURIComponent(data.msg) + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span>');
        } else {
            lastMsgUid = data.uid;
            var color = "";
            if (colorStack[data.uid] != undefined) {
                color = colorStack[data.uid];
            } else {
                color = getRandomColor();
                colorStack[data.uid] = color;
            }

            var message = '<div><div class="message"><span class="uid" style="color:' + color + ';">' + data.uid + '</span><span class="msg">' + decodeURIComponent(data.msg) + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span></div></div>';
            if (localStorage.getItem('mayday_userId') == data.uid) {
                message = '<div><div class="mymessage"><span class="msg">' + decodeURIComponent(data.msg) + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span></div></div>';
            }
            $('#messages').append(message);
        }
        $('#messages').animate({
            scrollTop: $('#messages').prop("scrollHeight")
        }, 500);
      }
     }
    });

    socket.on('private chat message', function(data) {
      if(data.sender == receiver || data.sender == localStorage.getItem('mayday_userId')){
        if (lastMsgUid != "" && lastMsgUid == data.sender) {
            $('#messages div').last().first().append('<span class="msg cmsg">' + decodeURIComponent(data.msg) + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span>');
        } else {
            var message;
            lastMsgUid = data.sender;
            var color = "";
            if (colorStack[data.sender] != undefined) {
                color = colorStack[data.sender];
            } else {
                color = getRandomColor();
                colorStack[data.sender] = color;
            }
            if (localStorage.getItem('mayday_userId') == data.sender) {
                var messageContent = "";
                if (data.msg_type == 'text') {
                    messageContent = decodeURIComponent(data.msg);
                } else if (data.msg_type == 'videochat_request') {
                    messageContent = 'You sent a video chat request';
                } else if (data.msg_type == 'videochat_request_accept') {
                    messageContent = 'You accepted the video chat request';
                } else if (data.msg_type == 'videochat_request_decline') {
                    messageContent = 'You declined the video chat request';
                } else if (data.msg_type == 'videochat_session_ended') {
                    messageContent = 'You ended the video chat. Total call duration: ' + data.duration;
                }else{
                    return;
                }

                message = '<div><div class="mymessage"><span class="msg">' + messageContent + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span></div></div>';
            }else{
                var messageContent = "";
                if (data.msg_type == 'text') {
                    messageContent = decodeURIComponent(data.msg);
                } else if (data.msg_type == 'videochat_request') {
                    messageContent = data.sender + ' sent a video chat request <a id="vc_accept" href="#" onclick="didAcceptVideoChatRequest()">Accept</a> or <a id="vc_decline" href="#" onclick="didDeclineVideoChatRequest()">Decline</a>';
                } else if (data.msg_type == 'videochat_request_accept') {
                    messageContent = data.sender + ' accepted your video chat request';
                } else if (data.msg_type == 'videochat_request_decline') {
                    messageContent = data.sender + ' declined your video chat request';
                } else if (data.msg_type == 'videochat_session_ended') {
                    messageContent = data.sender + ' ended the video chat. Total call duration: ' + data.duration;
                }else if (data.msg_type == 'videochat_request_unanswered') {
                    messageContent = data.sender+ '  did not answer your video request';
                }
                message = '<div><div class="message"><span class="uid" style="color:' + color + ';">' + data.sender + '</span><span class="msg">' + messageContent + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span></div></div>';
            }            
                $('#messages').append(message);
            } 
        $('#messages').animate({
            scrollTop: $('#messages').prop("scrollHeight")
        }, 500);
      }
      else {
                // Increase notification count of data.sender
                if(isNaN(unreadCount[data.sender])){
                    unreadCount[data.sender] = 0;
                    
                }               
                unreadCount[data.sender] = unreadCount[data.sender] +1;
                $('#xs-badge-'+data.sender).text(unreadCount[data.sender]);
                $('#badge-'+data.sender).text(unreadCount[data.sender]);
                if(data.msg_type == 'videochat_request'){                
                    setTimeout(function() { cannotAnswerVideoChatRequest(data.sender); }, 1000);        
                }
            }
    });

    socket.on('chatScrollUpResult', function(data) {
        //$('#messages').prepend($('<div>').attr('class', 'loading'));

        var delay=1000; //1 seconds
        if($('#messages div').length == 0){
            delay = 0;
        }
        setTimeout(function(){
          //your code to be executed after 1 seconds
        
        $('#messages').find('.loading').remove();
        signInMsg -= data.length;
        var firstMsgUid = "";

        for (var i = 0; i < data.length; i++) {

          var result = data[i];
          var msgDate = Date.parseExact(result.time_stamp,"yyyy-MM-dd HH:mm:ss");
          var ts = msgDate.toString('HH:mm');
          msgDate = msgDate.set({
                            second: 00,
                            minute: 00,
                            hour: 00,
                            });
           
                      if(timeStamp-msgDate >0){
                $('#messages').prepend($('<div>').text(timeStamp.toString('yyyy-MM-dd')).attr('class', 'userLog'));
                timeStamp = msgDate.clone();
                firstMsgUid = "";
           }
          if (firstMsgUid != "" && firstMsgUid == result.uid) {
            if (localStorage.getItem('mayday_userId') == result.uid) {
                $('#messages div div').first().prepend('<span class="msg cmsg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span>');
            }else{
              $('#messages div div span').first().after('<span class="msg cmsg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span>');
            }
            } else {
            firstMsgUid = result.uid;
            var color = "";
            if (colorStack[result.uid] != undefined) {
                color = colorStack[result.uid];
            } else {
                color = getRandomColor();
                colorStack[result.uid] = color;
            }

            var message = '<div><div class="message"><span class="uid" style="color:' + color + ';">' + result.uid + '</span><span class="msg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span></div></div>';

            if (localStorage.getItem('mayday_userId') == result.uid) {
                message = '<div><div class="mymessage"><span class="msg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span></div></div>';
            }
            $('#messages').prepend(message);
        }           
        }  
        }, delay); 
        if(delay == 0){
            $('#messages').animate({
            scrollTop: $('#messages').prop("scrollHeight") + 1000
        }, 500);        }
        //add to fetch announcements 
        socket.emit('fetch announcements');
    });


    socket.on('onlineUsersList', function(data) {
        $('#xs-menu').empty();
        $('#lg-menu').empty();
        for (var uid in data.online) {
            // var client = data;
            var color = "";
            if(localStorage.getItem('mayday_userId') != uid){
                if (colorStack[uid] != undefined) {
                    color = colorStack[uid];
                } else {
                    color = getRandomColor();
                    colorStack[uid] = color;
                }
                var path =  $("#topNav ul li.active").attr('data-path');
                if(path.indexOf('privatechat') != -1){
                    var xsLi = '<li id="xs-'+uid+'" class="text-center" style="color:'+color+';"><i class="fa fa-user"></i><div> <span class="badge" id="xs-badge-'+uid+'"></span></div></li>';
                    $('#xs-menu').append(xsLi);
                    var lgLi = '<li id="'+uid+'" style="color:'+color+';"><i class="fa fa-user"></i><div> '+uid+'  <span class="badge" id="badge-'+uid+'"></span></div></li>'; //'<li id="'+data.uid+'">'+data.uid+'</li>';
                    $('#lg-menu').append(lgLi);
                }
                else{
                    var xsLi = '<li id="xs-'+uid+'" class="text-center" style="color:'+color+';"><i class="fa fa-user"></i></li>';
                    $('#xs-menu').append(xsLi);
                    var lgLi = '<li id="'+uid+'" style="color:'+color+';"><i class="fa fa-user"></i> '+uid+'</li>'; //'<li id="'+data.uid+'">'+data.uid+'</li>';
                    $('#lg-menu').append(lgLi); 
                }
        }
            
        }
    });


    socket.on('user connected', function(data) {

        var id = String(data.uid);
        var path =  $("#topNav ul li.active").attr('data-path');
        if (localStorage.getItem('mayday_userId') != data.uid && $("#"+data.uid).length == 0) {
            var client = data.uid;
            var color = "";
            if (colorStack[client] != undefined) {
                color = colorStack[client];
            } else {
                color = getRandomColor();
                colorStack[client] = color;
            }
            
            if(path.indexOf('privatechat') != -1){
                var xsLi = '<li id="xs-'+client+'" class="text-center" style="color:'+color+';"><i class="fa fa-user"></i><div>  <span class="badge" id="xs-badge-'+client+'"></span></div></li>';
                $('#xs-menu').append(xsLi);
                var lgLi = '<li id="'+client+'" style="color:'+color+';"><i class="fa fa-user"></i><div> '+client+'  <span class="badge" id="badge-'+client+'"></span></div></li>'; //'<li id="'+data.uid+'">'+data.uid+'</li>';
                $('#lg-menu').append(lgLi);
            }else{
                 var xsLi = '<li id="xs-'+client+'" class="text-center" style="color:'+color+';"><i class="fa fa-user"></i></li>';
                $('#xs-menu').append(xsLi);
                var lgLi = '<li id="'+client+'" class="" style="color:'+color+';"><i class="fa fa-user"></i> '+client+'</li>'; //'<li id="'+data.uid+'">'+data.uid+'</li>';
                $('#lg-menu').append(lgLi);
                //$('#messages').append($('<div>').text(id + " joined").attr('class', 'userLog'));
                lastMsgUid = "";
            }
        } else {
            if(path.indexOf('privatechat') == -1){
                $("#messages").empty();
                socket.emit('onlineUsersList');
                signInMsg = data.msgid;
                socket.emit('chatScrollUp', {
                msgid: signInMsg
                });
            }else{
                
                socket.emit('onlineUsersList');
            }
        }

        $(".total").text("(" + (data.total - 1) + ")");

    });
    socket.on('getPrivateChatResult', function(data) {
        $("#messages").empty();

        var firstMsgUid = "";

        for (var i = 0; i < data.length; i++) {

          var result = data[i];
          var msgDate = Date.parseExact(result.time_stamp,"yyyy-MM-dd HH:mm:ss");
          var ts = msgDate.toString('HH:mm');
          msgDate = msgDate.set({
                            second: 00,
                            minute: 00,
                            hour: 00,
                            });
           
                      if(timeStamp-msgDate >0){
                $('#messages').prepend($('<div>').text(timeStamp.toString('yyyy-MM-dd')).attr('class', 'userLog'));
                timeStamp = msgDate.clone();
                firstMsgUid = "";
           }
          if (firstMsgUid != "" && firstMsgUid == result.sender) {
         //   console.log("result:"+ JSON.stringify(result));
            if (localStorage.getItem('mayday_userId') == result.sender) {
                $('#messages div div').first().prepend('<span class="msg cmsg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span>');
            }else{
              $('#messages div div span').first().after('<span class="msg cmsg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span>');
            }
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
            } else {
            firstMsgUid = result.sender;
            var color = "";
            if (colorStack[result.sender] != undefined) {
                color = colorStack[result.sender];
            } else {
                color = getRandomColor();


                colorStack[result.sender] = color;
            }

            var message = '<div><div class="message"><span class="uid" style="color:' + color + ';">' + result.sender + '</span><span class="msg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span></div></div>';


            if (localStorage.getItem('mayday_userId') == result.sender) {
                message = '<div><div class="mymessage"><span class="msg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span></div></div>';
            }
            $('#messages').prepend(message);
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
        }           
        }  

    });

    socket.on('user disconnected', function(data) {
        // alert("here")
        // $('#online_list').find('#' + data.uid).remove();
        var path =  $("#topNav ul li.active").attr('data-path');
        if(data.uid != localStorage.getItem('mayday_userId')){
            $('#xs-menu').find('#xs-' + data.uid).remove();
            $('#lg-menu').find('#' + data.uid).remove();;
                if(path.indexOf('privatechat') == -1){
                    // $('#messages').append($('<div>').text(data.uid + " left").attr('class', 'userLog'));
                    $('#messages').animate({
                        scrollTop: $('#messages').prop("scrollHeight") + 500
                }, 500);
            }else if(receiver == data.uid){
                var msgDiv='<div class="well" > <strong>User: '+receiver+' has left! </strong><i class="fa fa-comment"></i></div>'+
                      '<h5 style="padding-left: 10px;"> Click a <i class="fa fa-user"> name on the left to start chatting.... </i></h5>'+  
                      '<h5 style="padding-left: 10px;">All the messages sent will be private and only visible to the selected user. </h5>'+  
                      '<h5 style="padding-left: 10px;"> In case of unread chat messages, <i class="fa fa-bell"> you will be notified. </i> </h5>'+  
                '</div>';
                $('#messages').html(msgDiv);
                receiver = '';
                $('#chatInput').hide();
                if (localMediaStream) {
                    shutdownVideoChat();
                }
            }
            $(".total").text("(" + (data.total -1) + ")");
            lastMsgUid = "";
        }
        

    });
    // socket.disconnect();
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        if (color.toString().toLowerCase().indexOf("fffff") == 1)
            getRandomColor();
        return color;
    }

    //
    socket.on('showAnnouncements', function(data){
//        signInMsg -= data.length;
        var firstMsgUid = "";
        for (var i = 0; i < data.length; i++) {
            var result = data[i];
            var msgDate = Date.parseExact(result.time_stamp,"yyyy-MM-dd HH:mm:ss");
            var ts = msgDate.toString('HH:mm');
            msgDate = msgDate.set({
                            second: 00,
                            minute: 00,
                            hour: 00,
                            });
            var message = '<div><div class="announcement">[SYSTEM ANNOUNCEMENT]: ' + result.annon + '</div>';

            $('#messages').append(message);
/*           
            if(timeStamp-msgDate >0){
                $('#messages').prepend($('<div>').text(timeStamp.toString('yyyy-MM-dd')).attr('class', 'userLog'));
                timeStamp = msgDate.clone();
                firstMsgUid = "";
            }

*/            
/*            if(firstMsgUid != "" && firstMsgUid == result.uid) {
                $('#messages div div span').first().after('<span class="msg cmsg">' + result.msg + '</span><span class="mdate">' + ts + '</span>');
            }else {
                firstMsgUid = result.uid;
                var message = '<div><div class="message"><span class="uid" style="color:red";>' + result.uid + '</span><span class="msg">' + result.msg + '</span><span class="mdate">' + ts + '</span></div></div>';
                $('#messages').prepend(message);
            }           
*/        }

    });
    
        //socket.io.disconnect();
