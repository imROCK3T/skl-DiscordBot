// * MONUMENTS POLL
const {
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    // Move the votes object declaration here to reset it with each new poll
    const votes = {
      artic: [],
      silo: [],
      giant: [],
      water: [],
      power: [],
      launch: [],
      train: [],
      satellite: [],
      sewer: [],
      dome: [],
      airfield: [],
      mil_tunnels: [],
      mil_base: [],
    };

    const userVotes = {}; // Store user's votes

    if (interaction.isCommand() && interaction.commandName === "monumentos") {
      const allowedRoleIDs = ["836322454854303784", "836322454854303784"];
      const allowedUserIDs = ["405096240888676352"];

      // Check if the user has the allowed role or user ID
      const hasAllowedRole = interaction.member.roles.cache.some((role) =>
        allowedRoleIDs.includes(role.id)
      );
      const hasAllowedUser = allowedUserIDs.includes(interaction.user.id);

      if (!hasAllowedRole && !hasAllowedUser) {
        await interaction.reply("Não tens permissão para usar o comando.");
        return;
      }

      const user = interaction.user;

      if (interaction.replied || interaction.deferred) {
        // If the interaction has already been replied to or deferred, do nothing
        return;
      }

      await interaction.deferReply();

      const eventTitle = "Monumentos próximo Wipe:";
      const eventDescription = "Votem em duas opções.";

      const file = new AttachmentBuilder("../assets/logo.png");
      const exampleEmbed = new EmbedBuilder()
        .setColor("White")
        .setTitle(eventTitle)
        .setDescription(eventDescription)
        .setAuthor({
          name: "SKULL VOTE",
          iconURL: "https://i.imgur.com/LFxxOKj.png",
        })
        .setThumbnail("https://i.imgur.com/W8pjlYJ.png")
        .setImage("https://imgur.com/GbBayg3.gif")
        .setTimestamp()
        .setFooter({ text: ".skl team" }, "https://i.imgur.com/LFxxOKj.png");

      let buttonsRow1 = [
        new ButtonBuilder()
          .setCustomId("artic")
          .setLabel(`Artic (${votes.artic.length})`)
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("silo")
          .setLabel(`Silo (${votes.silo.length})`)
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("giant")
          .setLabel(`Giant (${votes.giant.length})`)
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("water")
          .setLabel(`Water (${votes.water.length})`)
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("power")
          .setLabel(`Power (${votes.power.length})`)
          .setStyle("Secondary"),
      ];

      let buttonsRow2 = [
        new ButtonBuilder()
          .setCustomId("launch")
          .setLabel(`Launch (${votes.launch.length})`)
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("train")
          .setLabel(`Train (${votes.train.length})`)
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("satellite")
          .setLabel(`Satellite (${votes.satellite.length})`)
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("sewer")
          .setLabel(`Sewer (${votes.sewer.length})`)
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("dome")
          .setLabel(`Dome (${votes.dome.length})`)
          .setStyle("Secondary"),
      ];

      let buttonsRow3 = [
        new ButtonBuilder()
          .setCustomId("airfield")
          .setLabel(`Airfield (${votes.airfield.length})`)
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("mil_tunnels")
          .setLabel(`Mil Tunnels (${votes.mil_tunnels.length})`)
          .setStyle("Secondary"),
        new ButtonBuilder()
          .setCustomId("mil_base")
          .setLabel(`Mil Base (${votes.mil_base.length})`)
          .setStyle("Secondary"),
      ];

      const channel = interaction.channel;

      const messageRow1 = await channel.send({
        embeds: [exampleEmbed],
        components: [new ActionRowBuilder().addComponents(...buttonsRow1)],
      });

      const messageRow2 = await channel.send({
        components: [new ActionRowBuilder().addComponents(...buttonsRow2)],
      });

      const messageRow3 = await channel.send({
        components: [new ActionRowBuilder().addComponents(...buttonsRow3)],
      });

      const filter = (i) =>
        [
          "artic",
          "silo",
          "giant",
          "water",
          "power",
          "launch",
          "train",
          "satellite",
          "sewer",
          "dome",
          "airfield",
          "mil_tunnels",
          "mil_base",
        ].includes(i.customId);

      const collectorRow1 = messageRow1.createMessageComponentCollector({
        filter,
      });

      const collectorRow2 = messageRow2.createMessageComponentCollector({
        filter,
      });

      const collectorRow3 = messageRow3.createMessageComponentCollector({
        filter,
      });

      const collectors = [collectorRow1, collectorRow2, collectorRow3];

      const userVotes = {}; // Store user's votes

      collectors.forEach((collector) => {
        collector.on("collect", async (i) => {
          console.log(`Collected ${i.customId}`);

          const { customId, user } = i;

          const selectedVote = votes[customId];

          if (!userVotes[user.id]) {
            userVotes[user.id] = []; // Initialize user's votes
          }

          const userCurrentVotes = userVotes[user.id];

          // Check if the user has already voted for the selected option
          if (userCurrentVotes.includes(customId)) {
            // Remove the user's vote for the selected option
            const index = userCurrentVotes.indexOf(customId);
            userCurrentVotes.splice(index, 1);

            // Update the vote count for the selected option
            const voteIndex = selectedVote.indexOf(user.id);
            selectedVote.splice(voteIndex, 1);
          } else {
            // Check if the user has already voted for two options
            if (userCurrentVotes.length >= 2) {
              await i.reply({
                content: "Máximo de votos atingido",
                ephemeral: true,
              });
              return;
            }

            // Add the user's vote for the selected option
            userCurrentVotes.push(customId);

            // Update the vote count for the selected option
            selectedVote.push(user.id);
          }

          // Rebuild the button arrays with updated labels
          buttonsRow1 = [
            new ButtonBuilder()
              .setCustomId("artic")
              .setLabel(`Artic (${votes.artic.length})`)
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("silo")
              .setLabel(`Silo (${votes.silo.length})`)
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("giant")
              .setLabel(`Giant (${votes.giant.length})`)
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("water")
              .setLabel(`Water (${votes.water.length})`)
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("power")
              .setLabel(`Power (${votes.power.length})`)
              .setStyle("Secondary"),
          ];

          buttonsRow2 = [
            new ButtonBuilder()
              .setCustomId("launch")
              .setLabel(`Launch (${votes.launch.length})`)
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("train")
              .setLabel(`Train (${votes.train.length})`)
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("satellite")
              .setLabel(`Satellite (${votes.satellite.length})`)
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("sewer")
              .setLabel(`Sewer (${votes.sewer.length})`)
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("dome")
              .setLabel(`Dome (${votes.dome.length})`)
              .setStyle("Secondary"),
          ];

          buttonsRow3 = [
            new ButtonBuilder()
              .setCustomId("airfield")
              .setLabel(`Airfield (${votes.airfield.length})`)
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("mil_tunnels")
              .setLabel(`Mil Tunnels (${votes.mil_tunnels.length})`)
              .setStyle("Secondary"),
            new ButtonBuilder()
              .setCustomId("mil_base")
              .setLabel(`Mil Base (${votes.mil_base.length})`)
              .setStyle("Secondary"),
          ];

          // Assign the updated buttons back to the respective rows
          const updatedRow1 = new ActionRowBuilder().addComponents(
            ...buttonsRow1
          );
          const updatedRow2 = new ActionRowBuilder().addComponents(
            ...buttonsRow2
          );
          const updatedRow3 = new ActionRowBuilder().addComponents(
            ...buttonsRow3
          );

          // Edit the message with the updated buttons
          await messageRow1.edit({
            components: [updatedRow1],
          });
          await messageRow2.edit({
            components: [updatedRow2],
          });
          await messageRow3.edit({
            components: [updatedRow3],
          });

          // Send an ephemeral message to the user indicating their vote was registered or removed
          await i.reply({
            content: userCurrentVotes.includes(customId)
              ? "Voto registado."
              : "Voto removido.",
            ephemeral: true,
          });
        });
      });
    }
  });
};
