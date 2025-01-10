// Initialisiere PeerJS
const peer = new Peer();

// Holen Sie sich die Video-Elemente
const myVideo = document.getElementById('myVideo');
const videoContainer = document.getElementById('videoContainer');

// Holen Sie sich die Buttons für Stummschaltung und Videoausschaltung
const muteBtn = document.getElementById('muteBtn');
const videoBtn = document.getElementById('videoBtn');
const startCallBtn = document.getElementById('startCall');
const shareBtn = document.getElementById('shareBtn');

// Anzeige-Element für Call-ID
const callIdElement = document.getElementById('callId');

let localStream;
let isMuted = false;
let isVideoOff = false;
let currentCall; // Variable für den aktuellen Anruf

// Funktion, um das lokale Video zu starten
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            myVideo.srcObject = stream;

            // Warten auf eingehende Peer-Verbindungen
            peer.on('call', (call) => {
                currentCall = call;
                call.answer(stream);
                call.on('stream', (remoteStream) => {
                    const peerVideoElement = document.createElement('video');
                    peerVideoElement.srcObject = remoteStream;
                    peerVideoElement.autoplay = true;
                    videoContainer.appendChild(peerVideoElement);
                });

                // Setze die Call-ID, sobald der Anruf angenommen wird
                callIdElement.textContent = `Call-ID: ${call.peer}`;
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
    currentCall = call;
    
    // Call-ID anzeigen
    callIdElement.textContent = `Call-ID: ${call.peer}`;

    call.on('stream', (remoteStream) => {
        const peerVideoElement = document.createElement('video');
        peerVideoElement.srcObject = remoteStream;
        peerVideoElement.autoplay = true;
        videoContainer.appendChild(peerVideoElement);
    });
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

// Share-Button Funktion
shareBtn.addEventListener('click', () => {
    const message = `Hier ist deine Call-ID: ${peer.id}. Um an diesem Videoanruf teilzunehmen, teile diese ID mit deinem Gesprächspartner. Gib die ID in das Eingabefeld ein und klicke auf "Start Video Call", um die Verbindung herzustellen.`;
    alert(message);
});

// Wenn die Peer-ID generiert wurde, wird sie im Call-ID-Element angezeigt
peer.on('open', id => {
    console.log('Meine Peer-ID ist: ' + id);
    callIdElement.textContent = `Peer-ID: ${id}`;  // Setzt die eigene Peer-ID als Call-ID
});

// Starte das Video
startVideo();
