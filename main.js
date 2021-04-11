const peer_id = document.getElementById('peer-id');
const remote_peer_form = document.getElementById("remote-peer-form");
const remote_peer_id = document.getElementById("remote-peer-id");
const connection_status = document.getElementById("connection-status")
const message_form = document.getElementById("message-form");
const message_content = document.getElementById("message-content");
const message_history = document.getElementsByClassName("msg_history")[0];
const disconnect_button = document.getElementById("disconnect-button");
const call_button = document.getElementById("call-button");
const hangup_button = document.getElementById("hangup-button");
const audio_element = document.getElementById("audio-element");

let peer = new Peer({
    config: {'iceServers': [
            { url: 'stun:stun.l.google.com:19302' },
            {
                url: 'turn:www.myturn.codes:3478',
                credential: 'iceburg',
                username: 'wasfooledbycp9'
            }
            ]},
    secure: true,
    path: '/'

});

peer.on('open', function(id) {    // on start
    console.log('My peer ID is: ' + id);
    peer_id.textContent = window.peerid = id;
});

var conn_list = [];  // initially unconnected
var localStream = null; //initially unconnected

function ready(conn) {
    console.log("ready", conn);

        conn.on('data', function (data) {
            console.log("Data recieved");
            appendIncoming(conn.peer+" " + data)
        });
        conn.on('close', function () {
            show_disconnected();
        });

}

peer.on('connection', async function(c) {
    c.on('open', function() {
        console.log("connecting to a new client", c.peer);
    });
    await conn_list.push(c);
    show_connected(c, conn_list);
    console.log("Connected to: " + c.peer);
    ready(c);
});

let renderAudio = (stream) => {
    audio_element.srcObject = stream;
};

// Handle incoming voice/video connection
peer.on('call', (call) => {
    navigator.mediaDevices.getUserMedia({video: false, audio: true})
        .then((stream) => {
            call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', renderAudio);
            localStream = stream;
        })
        .catch((err) => {
            console.error('Failed to get local stream', err);
        });
});

call_button.onclick = function(){
    navigator.mediaDevices.getUserMedia({video: false, audio: true})
        .then((stream) => {
            for (let i in conn_list){
                let call = peer.call(conn_list[i].peer, stream);
                console.log("calling", conn_list[i].peer)
                call.on('stream', renderAudio);
                localStream = stream;
            }
        })
        .catch((err) => {
            logMessage('Failed to get local stream', err);
        });
}

hangup_button.onclick = function(){
    audio_element.pause();
    localStream.getTracks().forEach(function(track) {
        if (track.readyState == 'live' && track.kind === 'audio') {
            track.stop();
        }
    });

}


remote_peer_form.onsubmit = function(e){
    e.preventDefault()
    let conn = peer.connect(remote_peer_id.value,{
        reliable: true
    });

    conn_list.push(conn);
    conn.on('open', function() {
        console.log("Connected to: " +conn.peer);
        show_connected(conn, conn_list)
    });

    conn.on('data', function(data) {
        console.log('Received message', data);
        appendIncoming(conn.peer+" " + data);
    });

    conn.on('close', function () {
        show_disconnected();
    });
    console.log("conn_list", conn_list);
    setTimeout(function() { remote_peer_form.reset(); }, 5000);
}

function appendOutgoing(newMessage){
    outgoingMsg = document.createElement('div');
    outgoingMsg.classList.add('outgoing_msg');

    sentMsg = document.createElement('div');
    sentMsg.classList.add('sent_msg');

    msgContent = document.createElement('p')
    msgContent.textContent = newMessage

    sentMsg.appendChild(msgContent);
    outgoingMsg.appendChild(sentMsg);
    message_history.appendChild(outgoingMsg)

}

function appendIncoming(newMessage){
    incomingMsg = document.createElement('div');
    incomingMsg.classList.add('incoming_msg');

    incomingMsgImg = document.createElement('img');
    incomingMsgImg.src="https://ptetutorials.com/images/user-profile.png";
    incomingMsgImgdiv = document.createElement('div');
    incomingMsgImgdiv.classList.add('incoming_msg_img');
    incomingMsgImgdiv.appendChild(incomingMsgImg)



    recievedMsg = document.createElement('div');
    recievedMsg.classList.add('received_msg');

    recievedWithdMsg = document.createElement('div');
    recievedWithdMsg.classList.add('received_withd_msg');

    msgContent = document.createElement('p')
    msgContent.textContent = newMessage

    recievedWithdMsg.appendChild(msgContent);
    recievedMsg.appendChild(recievedWithdMsg);

    incomingMsg.appendChild(incomingMsgImgdiv)
    incomingMsg.appendChild(recievedMsg)
    message_history.appendChild(incomingMsg)

}


message_form.onsubmit = function(e){
    e.preventDefault();
    const newMessage = message_content.value;
    if(conn_list.length !== 0){
        for (let i in conn_list){
            let conn = conn_list[i];
            conn.send(newMessage)
        }
    }else{
        console.log("WARNING: not connected to any peer");
        return;
    }
    appendOutgoing(newMessage);
    this.reset()
}


function show_connected(conn, conn_list){

    console.log("inside show_connected", conn_list);
    window.conn_list = conn_list;
    if(conn_list.length === 0)
        return;
    if (conn_list.length === 1){
        connection_status.innerHTML = "connected to " + conn_list[0].peer;
    }else{
        connection_status.innerHTML += " and connected to " + conn_list[conn_list.length-1].peer;
    }
    disconnect_button.style.display = 'block';
}

function show_disconnected(){
    if(conn_list.length !== 0){
        for (let i in conn_list){
            let conn = conn_list[i];
            conn.close();
        }
    }
    window.conn_list = conn_list = [];
    connection_status.innerHTML = "unconnected";
    disconnect_button.style.display = 'none';
    while (message_history.hasChildNodes()) {
        message_history.removeChild(message_history.lastChild);
    }
}

disconnect_button.onclick = show_disconnected;