const clients = new Map();

export const setupWebSocket = (wss) => {
  wss.on('connection', (ws) => {
    const clientId = Date.now().toString();
    clients.set(clientId, {
      ws,
      userId: null,
      isTraining: false,
    });

    console.log(`✅ WebSocket client connected: ${clientId}`);

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        handleWebSocketMessage(clientId, message, wss);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log(`❌ WebSocket client disconnected: ${clientId}`);
      clients.delete(clientId);
      broadcastOnlineUsers(wss);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
};

const handleWebSocketMessage = (clientId, message, wss) => {
  const client = clients.get(clientId);
  
  switch (message.type) {
    case 'AUTH':
      client.userId = message.userId;
      broadcastOnlineUsers(wss);
      break;
    
    case 'TRAINING_START':
      client.isTraining = true;
      broadcastTrainingStatus(wss, message.userId, 'START', message.workout);
      break;
    
    case 'TRAINING_UPDATE':
      broadcastTrainingStatus(wss, message.userId, 'UPDATE', message.workoutData);
      break;
    
    case 'TRAINING_END':
      client.isTraining = false;
      broadcastTrainingStatus(wss, message.userId, 'END', null);
      break;
  }
};

const broadcastOnlineUsers = (wss) => {
  const onlineUsers = Array.from(clients.values())
    .filter(c => c.userId)
    .map(c => c.userId);

  const message = JSON.stringify({
    type: 'ONLINE_USERS',
    users: onlineUsers,
  });

  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
};

const broadcastTrainingStatus = (wss, userId, status, data) => {
  const message = JSON.stringify({
    type: 'TRAINING_STATUS',
    userId,
    status,
    data,
  });

  wss.clients.forEach(client => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
};
