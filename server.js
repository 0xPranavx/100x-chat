const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  

  socket.on('message', ({ username, message }) => {
   
    const emojiMapping = {
      hey: '👋',
      react:'⚛️',
      woah: ' 😲',
      lol: '😂',
      like:'👍',
      congratulations: '🎉',
      // Add more mappings as needed
    };
    const words = message.split(' ');
    const replacedWords = words.map((word) => emojiMapping[word.toLowerCase()] || word);
    const replacedMessage = replacedWords.join(' ');

    io.emit('message', { username, message: replacedMessage });
  });

  socket.on('command', (command) => {
    if (command.toLowerCase() === '/help') {
      socket.emit('message', { username: 'Server', message: 'Available commands: /random, /clear' });
    } else if (command.toLowerCase() === '/random') {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      socket.emit('message', { username: 'Server', message: `Random number: ${randomNumber}` });
    } else if (command.toLowerCase() === '/clear') {
      io.emit('clear');
    }
  });

  socket.on('disconnect', () => {
    
  });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  
});
