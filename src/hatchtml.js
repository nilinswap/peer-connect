
let chat_popup_html_string= `
    <div class="container">


<!--        for chat popup-->
        <button class="open-button" id="open-chat-button" >Chat</button>

        <div class="chat-popup" id="myForm">
            <p> Your Peer Id is - <span id="peer-id"></span></p>
            <br>
            <form id="remote-peer-form" action="" method="GET">
                <label for="remote-peer-id">Enter a Peer Id to connect with - </label>
                <input name="remote-peer-id" id="remote-peer-id">
                <input type="submit">
            </form>

            <div id="notice-board">
                <p>Status is - <span id="connection-status"> unconnected. </span></p>
                <button id="disconnect-button" style="display: none;">Disconnect</button>
            </div>

            <div id="audio-div">
                <audio id="audio-element" autoplay controls ></audio>
                <button id="call-button">call</button>
                <button id="hangup-button">hang up</button>
            </div>



            <div class="messaging">
                <div class="inbox_msg">

                    <div class="mesgs" id="mesgs-scrollable">
                        <div class="msg_history">

                        </div>

                    </div>
                </div>

                <form id="message-form" action="" method="POST">
                    <input name="message-content" id="message-content">
                    <input type="submit" value="send">
                </form>

            </div>
            <button type="button" class="btn cancel"  id="close-chat-button" >Close</button>
        </div>
        <div >
            created by nilinswap
        </div>
    </div>
`;

export default chat_popup_html_string;

