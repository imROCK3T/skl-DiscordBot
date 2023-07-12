// * BEETLE
const videos = require("./videos.json");

module.exports = (client) => {
  client.on("messageCreate", (msg) => {
    if (msg.content === "!beetle") {
      const channel = msg.channel;
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      channel.send(randomVideo);
    }
  });
};
