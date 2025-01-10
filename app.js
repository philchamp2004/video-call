// Initialisiere PeerJS
const peer = new Peer();

// Zugriff auf das eigene Kamera- und Mikrofon-Stream
let localStream;

// Holen Sie sich die Video-Elemente
const myVideo = document.getElementById('myVideo');
const peerVideo = document.getElementById('peerVideo');

// Anzeige-Element für Peer-ID
const peerIdElement = document.getElementById('peerId');

// Funktion, um das lokale Video zu starten
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            myVideo.srcObject = stream;

            // Warten auf eingehende Peer-Verbindungen
            peer.on('call', (call) => {
                call.answer(stream);
                call.on('stream', (remoteStream) => {
                    peerVideo.srcObject = remoteStream;
                });
            });
        })
        .catch(err => {
            console.error('Fehler beim Zugreifen auf die Kamera:', err);
        });
}

// Funktion, um den Videoanruf zu starten
document.getElementById('startCall').addEventListener('click', () => {
    const peerId = prompt('Gib die Peer-ID des anderen Teilnehmers ein:');
    const call = peer.call(peerId, localStream);
    call.on('stream', (remoteStream) => {
        peerVideo.srcObject = remoteStream;
    });
});

// Wenn die Peer-ID generiert wurde, wird sie im Peer-ID-Element angezeigt
peer.on('open', id => {
    console.log('Meine Peer-ID ist: ' + id);
    peerIdElement.textContent = id;  // Setzt die Peer-ID auf der Webseite
});

// Starte das Video
startVideo();