require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { OpenAI } = require('openai');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3000;

// Retrieve your OpenAI API Key from environment variables
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: openaiApiKey });

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', async (msg) => {
    console.log('message: ' + msg);

    // Ensure that the OpenAI API key has been set
    if (!openaiApiKey) {
      console.error('OpenAI API key is not set.');
      socket.emit('chat message', 'Server error: OpenAI API key is missing.');
      return;
    }

    try {
      const response = await openai.createImage({
        model: "dall-e-3",
        prompt: msg,
        n: 1,
        size: "1024x1024",
      });

      const image_url = response.data.data[0].url;
      io.emit('chat message', `Generated Image: ${image_url}`);
    } catch (error) {
      console.error('Error generating image:', error);
      socket.emit('chat message', 'Sorry, there was an error generating the image.');
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Chatbot app listening at http://localhost:${port}`);
});
