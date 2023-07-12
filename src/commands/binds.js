// * Binds
const { EmbedBuilder } = require("discord.js");
const userBinds = require("./userBinds.json");

// Atualiza a função que lida com mensagens recebidas
module.exports = (client) => {
  client.on("messageCreate", (message) => {
    if (message.author.bot) {
      return;
    }

    if (message.content === "!binds") {
      const userId = message.author.id;
      const userBindInfo = userBinds[userId];

      if (!userBindInfo) {
        message.reply(
          `${message.author.tag}, you don't have any binds saved. Send them to Rocket if you want me to store them.`
        );
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`${message.author.tag}'s Rust binds:`)
        .setColor("Red")
        .addFields(...userBindInfo);

      message.channel.send({ embeds: [embed] });
    }
  });
};
