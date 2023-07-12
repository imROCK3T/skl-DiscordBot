require("dotenv").config();
const Discord = require("discord.js");

const {
  Client,
  IntentsBitField,
  ActivityType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ActionRowBuilder,
  AttachmentBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
  ],
});

// * BOT LOG
client.on("ready", (c) => {
  console.log(`✔ ${c.user.tag} bot is online! ✔`);

  client.user.setActivity({
    name: "skl on top",
    type: ActivityType.Watching,
  });
});

// Require the code.js file and pass the client object
require("./commands/code.js")(client);
require("./commands/binds.js")(client);
require("./commands/poll.js")(client);
require("./commands/event.js")(client);
require("./commands/beetle.js")(client);
require("./commands/poll-monumentos.js")(client);

client.login(process.env.TOKEN);
