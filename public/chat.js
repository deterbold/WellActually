document.addEventListener('DOMContentLoaded', function() {
  const socket = io();

  const sendButton = document.getElementById('sendPrompt');
  const messageInput = document.getElementById('prompt');

  sendButton.addEventListener('click', function() {
    const message = messageInput.value;
    messageInput.value = '';
    socket.emit('chat message', message);
  });

  // Listen for chat messages from the server to display them
  socket.on('chat message', function(msg) {
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    messages.appendChild(messageElement);
  });
});
