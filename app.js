// Initialisiere PeerJS
const peer = new Peer();

// Holen Sie sich die Video-Elemente
const myVideo = document.getElementById('myVideo');
const peerVideo = document.getElementById('peerVideo');

// Holen Sie sich die Buttons für Stummschaltung und Videoausschaltung
const muteBtn = document.getElementById('muteBtn');
const videoBtn = document.getElementById('videoBtn');
const startCallBtn = document.getElementById('startCall');

// Anzeige-Element für Peer-ID
const peerIdElement = document.getElementById('peerId');

let localStream;
let isMuted = false;
let isVideoOff = false;

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
startCallBtn.addEventListener('click', () => {
    const peerId = prompt('Gib die Peer-ID des anderen Teilnehmers ein:');
    const call = peer.call(peerId, localStream);
    call.on('stream', (remoteStream) => {
        peerVideo.srcObject = remoteStream;
    });
});

// Mute/Unmute-Funktion
muteBtn.addEventListener('click', () => {
    const audioTracks = localStream.getAudioTracks();
    isMuted = !isMuted;
    audioTracks.forEach(track => track.enabled = !isMuted);
    muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
});

// Video ausschalten/einschalten
videoBtn.addEventListener('click', () => {
    const videoTracks = localStream.getVideoTracks();
    isVideoOff = !isVideoOff;
    videoTracks.forEach(track => track.enabled = !isVideoOff);
    videoBtn.textContent = isVideoOff ? 'Turn Video On' : 'Turn Video Off';
});

// Wenn die Peer-ID generiert wurde, wird sie im Peer-ID-Element angezeigt
peer.on('open', id => {
    console.log('Meine Peer-ID ist: ' + id);
    peerIdElement.textContent = id;  // Setzt die Peer-ID auf der Webseite
});

// Starte das Video
startVideo();
