// Initialisiere PeerJS
const peer = new Peer();

// Holen Sie sich die Video-Elemente
const myVideo = document.getElementById('myVideo');
const videoContainer = document.getElementById('videoContainer');

// Holen Sie sich die Buttons für Stummschaltung und Videoausschaltung
const muteBtn = document.getElementById('muteBtn');
const videoBtn = document.getElementById('videoBtn');
const startCallBtn = document.getElementById('startCall');

// Anzeige-Element für Call-ID
const callIdElement = document.getElementById('callId');

let localStream;
let isMuted = false;
let isVideoOff = false;
let connections = {}; // Zum Speichern der Peer-Verbindungen

// Funktion, um das lokale Video zu starten
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            myVideo.srcObject = stream;

            // Warten auf eingehende Peer-Verbindungen
            peer.on('call', (call) => {
                // Anruf beantworten und den Stream des anderen Peers anzeigen
                call.answer(stream);
                const videoElement = document.createElement('video');
                videoElement.srcObject = stream;
                videoElement.autoplay = true;
                videoContainer.appendChild(videoElement);

                // Wenn der Stream des anderen Peers eintrifft
                call.on('stream', (remoteStream) => {
                    const peerVideoElement = document.createElement('video');
                    peerVideoElement.srcObject = remoteStream;
                    peerVideoElement.autoplay = true;
                    videoContainer.appendChild(peerVideoElement);
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
    
    // Call-ID anzeigen
    callIdElement.textContent = `Call-ID: ${call.peer}`;

    call.on('stream', (remoteStream) => {
        const peerVideoElement = document.createElement('video');
        peerVideoElement.srcObject = remoteStream;
        peerVideoElement.autoplay = true;
        videoContainer.appendChild(peerVideoElement);
    });

    // Verbindung speichern
    connections[call.peer] = call;
});

// Mute/Unmute-Funktion
muteBtn.addEventListener('click', () => {
    const audioTracks = localStream.getAudioTracks();
    isMuted = !isMuted;

    // Audio-Track aktivieren oder deaktivieren
    audioTracks.forEach(track => {
        track.enabled = !isMuted;
    });
    
    muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
});

// Video ausschalten/einschalten
videoBtn.addEventListener('click', () => {
    const videoTracks = localStream.getVideoTracks();
    isVideoOff = !isVideoOff;

    // Video-Track aktivieren oder deaktivieren
    videoTracks.forEach(track => {
        track.enabled = !isVideoOff;
    });
    
    videoBtn.textContent = isVideoOff ? 'Turn Video On' : 'Turn Video Off';
});

// Wenn die Peer-ID generiert wurde, wird sie im Call-ID-Element angezeigt
peer.on('open', id => {
    console.log('Meine Peer-ID ist: ' + id);
    callIdElement.textContent = `Peer-ID: ${id}`;  // Setzt die eigene Peer-ID als Call-ID
});

// Starte das Video
startVideo();
