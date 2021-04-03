var peer = new Peer();
console.log("peer", peer);

const peeriddiv = document.getElementById('peer-id');
const remotepeerform = document.getElementById("remote-peer-form");
const remotepeerid = document.getElementById("remote-peer-id");
const noticeBoard = document.getElementById("notice-board");
const messageForm = document.getElementById("message-form");
const messageContent = document.getElementById("message-content");
const messageHistory = document.getElementsByClassName("msg_history")[0];


peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    peeriddiv.textContent = window.peerid = id;
});

peer.on('connection', function(conn) {
    conn.on('data', function(data){
        console.log("recieved messsage:", data);
        newIncomingMessage = data;

        appendIncoming(newIncomingMessage)
    });
    conn.on('open', () => {
        conn.send('AHello from ' + window.peerid );
    });
});

var conn = null;
remotepeerform.onsubmit = function(e){
    e.preventDefault()
    window.remotepeerid=remotepeerid;
    var remotePeerId = remotepeerid.value
    noticeBoard.textContent = "connecting with " + remotePeerId + " ..."
    conn = peer.connect(remotePeerId);
    conn.on('open', function() {
        // Receive messages
        conn.on('data', function(data) {
            console.log('Received message', data);
        });
        // Send messages
        conn.send('BHello from ' + window.peerid );
    });

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
    messageHistory.appendChild(outgoingMsg)

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
    messageHistory.appendChild(incomingMsg)

}

messageForm.onsubmit = function(e){
    e.preventDefault();
    const newMessage = messageContent.value;
    conn.send(newMessage)
    appendOutgoing(newMessage);
}

