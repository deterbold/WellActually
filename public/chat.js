document.addEventListener('DOMContentLoaded', function() {
  const socket = io();

  const sendButton = document.getElementById('sendPrompt');
  const messageInput = document.getElementById('prompt');

  // Function to emit the prompt message
  function sendPrompt() {
    const message = messageInput.value.trim();
    if (message) {
      socket.emit('chat message', message);
      messageInput.value = ''; // Clear the input after sending
    }
  }

  messageInput.addEventListener('input', function() {
    this.style.height = 'auto'; // Reset height to recalculate
    this.style.height = (this.scrollHeight) + 'px'; // Set new height
  });

  // Event listener for the Send button
  sendButton.addEventListener('click', sendPrompt);

  // Event listener for the textarea to listen for Command+Enter or Ctrl+Enter
  messageInput.addEventListener('keydown', function(event) {
    // Check for Command+Enter on Mac or Ctrl+Enter on PC
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault(); // Prevent the default action to avoid line breaks in the textarea
      sendPrompt();
    }
  });

  // Listen for chat messages from the server to display them
  socket.on('chat message', function(msg) {
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    messages.appendChild(messageElement);
  });
});
