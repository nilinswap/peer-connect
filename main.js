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

var peer = new Peer();

peer.on('open', function(id) {    // on start
    console.log('My peer ID is: ' + id);
    peer_id.textContent = window.peerid = id;
});

var conn = null;  // initially unconnected
var remotePeerId = null; // initially unknown
var localStream = null; //initially unconnected

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
    setTimeout(function() { remote_peer_form.reset(); }, 500);
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
    if(conn && conn.open){
        conn.send(newMessage)
    }else{
        console.log("WARNING: not connected to any peer");
        return;
    }
    appendOutgoing(newMessage);
    this.reset()
}


function show_connected(c, peer){
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