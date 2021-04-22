import * as utils from "./utils.js"

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

let conn = null;  // initially unconnected
let remotePeerId = null; // initially unknown
let localStream = null; //initially unconnected

let peer = new Peer({
    config: {'iceServers': [
            { url: 'stun:turn.myturn.codes:3478' },
            {
                url: 'turn:turn.myturn.codes:3478',
                credential: 'wasfooledbycp9',
                username: 'iceburg'
            }
            ],
    },
    iceTransportPolicy: 'relay',
    debug: 3,
    secure: true,
    path: '/'

});

console.log("deployed  Anna Hajare same url");

peer.on('open', function(id) {    // on start
    console.log('My peer ID is: ' + id);
    peer_id.textContent = window.peerid = id;
});



function ready() {
    conn.on('data', function (data) {
        console.log("Data recieved");
        appendIncoming(data)
    });
    conn.on('close', function () {
        show_disconnected();
    });
}

peer.on('connection', function(c) {
    if(conn && conn.open){ //if already connected.
        c.on('open', function() {
            c.send("Already connected to another client");
            console.log("WARNING: Already connected to another cleint");
            setTimeout(function() { c.close(); }, 5000);
        });
        return;
    }
    conn = window.conn = c;  //IPH set connection
    show_connected(c, conn.peer);
    console.log("Connected to: " + conn.peer);
    ready();
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

            let call = peer.call(conn.peer, stream);
            console.log("calling", conn.peer)
            call.on('stream', renderAudio);
            localStream = stream;

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
    if(conn && conn.open){ //if already connected
        console.log("WARNING: already connected to: " + remotePeerId); //TODO: Allow disconnect
        return;
    }
    conn = peer.connect(remote_peer_id.value);
    conn.on('open', function() {
        show_connected(conn, conn.peer)
        console.log("Connected to: " +remotePeerId);
    });

    conn.on('data', function(data) {
        console.log('Received message', data);
        appendIncoming(data);
    });

    conn.on('close', function () {
        show_disconnected();
    });
    setTimeout(function() { remote_peer_form.reset(); }, 5000);
}

function appendOutgoing(newMessage){
    let outgoingMsg = document.createElement('div');
    outgoingMsg.classList.add('outgoing_msg');

    let sentMsg = document.createElement('div');
    sentMsg.classList.add('sent_msg');

    let msgContent = document.createElement('p')
    msgContent.textContent = newMessage

    sentMsg.appendChild(msgContent);
    outgoingMsg.appendChild(sentMsg);
    message_history.appendChild(outgoingMsg)
    utils.updateScroll();

}

function appendIncoming(newMessage){
    let incomingMsg = document.createElement('div');
    incomingMsg.classList.add('incoming_msg');

    let incomingMsgImg = document.createElement('img');
    incomingMsgImg.src="https://ptetutorials.com/images/user-profile.png";
    let incomingMsgImgdiv = document.createElement('div');
    incomingMsgImgdiv.classList.add('incoming_msg_img');
    incomingMsgImgdiv.appendChild(incomingMsgImg)



    let recievedMsg = document.createElement('div');
    recievedMsg.classList.add('received_msg');

    let recievedWithdMsg = document.createElement('div');
    recievedWithdMsg.classList.add('received_withd_msg');

    let msgContent = document.createElement('p')
    msgContent.textContent = newMessage

    recievedWithdMsg.appendChild(msgContent);
    recievedMsg.appendChild(recievedWithdMsg);

    incomingMsg.appendChild(incomingMsgImgdiv)
    incomingMsg.appendChild(recievedMsg)
    message_history.appendChild(incomingMsg)
    utils.updateScroll();
}


message_form.onsubmit = function(e){
    e.preventDefault();
    const newMessage = message_content.value;
    if(conn && conn.open){
        console.log("sending data", newMessage);
        conn.send(newMessage)
    }else{
        console.log("WARNING: not connected to any peer");
        return;
    }
    appendOutgoing(newMessage);
    this.reset()
}


function show_connected(c, peer) {
    window.conn = conn = c;
    window.remotePeerId = remotePeerId = peer;
    connection_status.innerHTML = "connected to " + remotePeerId;
    disconnect_button.style.display = 'block';
}

function show_disconnected(){
    if(conn)
        conn.close();
    window.conn = conn = null;
    window.remotePeerId = remotePeerId = null;

    connection_status.innerHTML = "unconnected";
    disconnect_button.style.display = 'none';
    while (message_history.hasChildNodes()) {
        message_history.removeChild(message_history.lastChild);
    }
}

disconnect_button.onclick = show_disconnected;