const {
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    console.log("Received interaction:", interaction);
    if (interaction.isCommand() && interaction.commandName === "evento") {
      // Check if the user has the allowed role or user ID
      const allowedRoleIDs = ["836322454854303784", "836322454854303784"];
      const allowedUserIDs = ["405096240888676352"];

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

      const dmChannel = await user.createDM();
      await dmChannel.send("Adiciona o titulo do evento:");

      try {
        const filter = (message) => message.author.id === user.id;

        const titleMessage = await dmChannel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ["time"],
        });

        const eventTitle = titleMessage.first().content;
        console.log("Event Title:", eventTitle);

        await dmChannel.send("Adiciona a descrição do evento:");

        const descriptionMessage = await dmChannel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ["time"],
        });

        const eventDescription = descriptionMessage.first().content;
        console.log("Event Description:", eventDescription);

        const votes = {
          yes: [],
          no: [],
          maybe: [],
        };

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
          .setFooter({
            text: ".skl team",
            iconURL: "https://i.imgur.com/LFxxOKj.png",
          });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("yes")
            .setLabel(`Sim (${votes.yes.length})`)
            .setStyle("Success"),
          new ButtonBuilder()
            .setCustomId("no")
            .setLabel(`Não (${votes.no.length})`)
            .setStyle("Danger"),
          new ButtonBuilder()
            .setCustomId("maybe")
            .setLabel(`Talvez (${votes.maybe.length})`)
            .setStyle("Secondary")
        );

        const channel = interaction.channel;
        const message = await channel.send({
          content: "@everyone: Votem todos!",
          embeds: [exampleEmbed],
          components: [row],
        });

        const filterTwo = (i) =>
          i.customId === "yes" || i.customId === "no" || i.customId === "maybe";
        const collector = message.createMessageComponentCollector({
          filter: filterTwo,
        });

        collector.on("collect", async (i) => {
          console.log(`Collected ${i.customId}`);

          const { customId, user } = i;

          const member = await channel.guild.members.fetch(user.id);
          const voterUsername = member ? member.displayName : user.username;

          const currentVote = votes[customId];
          const otherVotes = Object.keys(votes).filter(
            (vote) => vote !== customId
          );

          // Remove the user's vote from other options
          otherVotes.forEach((vote) => {
            const index = votes[vote].indexOf(user.id);
            if (index > -1) {
              votes[vote].splice(index, 1);
            }
          });

          // Toggle the user's vote for the selected option
          const index = currentVote.indexOf(user.id);
          if (index > -1) {
            currentVote.splice(index, 1);
          } else {
            currentVote.push(user.id);
          }

          // Update the button labels with vote counts
          row.components[0].setLabel(`Sim (${votes.yes.length})`);
          row.components[1].setLabel(`Não (${votes.no.length})`);
          row.components[2].setLabel(`Talvez (${votes.maybe.length})`);

          // Update the embed footer with the names of users who voted
          const userNames = {
            yes: votes.yes.map((userId) => {
              const member = channel.guild.members.cache.get(userId);
              return member ? member.displayName : "Unknown";
            }),
            no: votes.no.map((userId) => {
              const member = channel.guild.members.cache.get(userId);
              return member ? member.displayName : "Unknown";
            }),
            maybe: votes.maybe.map((userId) => {
              const member = channel.guild.members.cache.get(userId);
              return member ? member.displayName : "Unknown";
            }),
          };
          exampleEmbed.setFooter({
            text: `.skl team\nYes (${votes.yes.length}): ${userNames.yes.join(
              ", "
            )}\nNo (${votes.no.length}): ${userNames.no.join(", ")}\nMaybe (${
              votes.maybe.length
            }): ${userNames.maybe.join(", ")}`,
            setImage: "https://imgur.com/Rid84AS.png",
          });

          // Edit the message with the updated buttons and embed
          await message.edit({
            components: [row],
            embeds: [exampleEmbed],
          });

          // Send an ephemeral message to the user indicating their vote was registered or removed
          await i.reply({
            content: currentVote.includes(user.id)
              ? "Voto registado."
              : "Voto removido.",

            ephemeral: true,
          });
        });
      } catch (error) {
        console.error(error);
        await interaction.followUp({
          content: "Erro a colectar informação.",
          ephemeral: true,
        });
      }
    }
  });
};
