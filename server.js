const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

let players = {};

wss.on("connection", function connection(ws) {
  const id = Date.now();
  players[id] = { x: 0, y: 0 };

  ws.on("message", function incoming(message) {
    try {
      const data = JSON.parse(message);
      if (data.type === "move") {
        players[id].x = data.x;
        players[id].y = data.y;
      }
    } catch (e) {
      console.log("Invalid message received:", message);
    }
  });

  ws.on("close", () => {
    delete players[id];
  });

  const sendUpdates = setInterval(() => {
    ws.send(
      JSON.stringify({
        type: "update",
        players: players,
      })
    );
  }, 50);

  ws.on("close", () => {
    clearInterval(sendUpdates);
  });
});

console.log(`WebSocket server running on port ${PORT}`);
