var peer = new Peer();
console.log("peer", peer);

const peeriddiv = document.getElementById('peer-id');
const remotepeerform = document.getElementById("remote-peer-form");
const remotepeerid = document.getElementById("remote-peer-id");
const noticeBoard = document.getElementById("notice-board");


peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    peeriddiv.textContent = window.peerid = id;
});

peer.on('connection', function(conn) {
    conn.on('data', function(data){
        console.log("recieved messsage:", data);
    });
    conn.on('open', () => {
        conn.send('AHello from ' + window.peerid );
    });
});

remotepeerform.onsubmit = function(e){
    e.preventDefault()
    window.remotepeerid=remotepeerid;
    var remotePeerId = remotepeerid.value
    noticeBoard.textContent = "connecting with " + remotePeerId + " ..."
    var conn = peer.connect(remotePeerId);
    conn.on('open', function() {
        // Receive messages
        conn.on('data', function(data) {
            console.log('Received message', data);
        });
        // Send messages
        conn.send('BHello from ' + window.peerid );
    });

}






