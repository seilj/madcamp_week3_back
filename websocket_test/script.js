let socket;

function connectWebSocket() {
    socket = new WebSocket('ws://localhost:3000');

    socket.onopen = function(event) {
        console.log('WebSocket connection established');
        document.getElementById('messages').innerHTML += '<p>WebSocket connection established</p>';
    };

    socket.onmessage = function(event) {
        console.log('Message from server ', event.data);
        document.getElementById('messages').innerHTML += '<p>Message from server: ' + event.data + '</p>';
    };

    socket.onclose = function(event) {
        console.log('WebSocket connection closed');
        document.getElementById('messages').innerHTML += '<p>WebSocket connection closed</p>';
    };

    socket.onerror = function(event) {
        console.error('WebSocket error observed:', event);
        document.getElementById('messages').innerHTML += '<p>WebSocket error: ' + event + '</p>';
    };
}

function sendMessage() {
    const message = {
        event: 'createMeeting',
        data: {
            title: 'Soccer Match Meetup',
            maxParticipants: 20,
            pubAddress: '123 Pub Street, City',
            supportTeam: 'Home Team',
            date: '2024-08-15',
            time: '18:00~20:00',
            creatorId: 'user123'
        }
    };

    socket.send(JSON.stringify(message));
    console.log('Sent message:', message);
    document.getElementById('messages').innerHTML += '<p>Sent message: ' + JSON.stringify(message) + '</p>';
}
