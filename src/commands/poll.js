// * CUSTOM POLL

const {
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

const votes = {};

module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.commandName === "poll") {
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
      await dmChannel.send("Qual a pergunta para a votação?");

      try {
        const filter = (message) => message.author.id === user.id;

        const questionMessage = await dmChannel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ["time"],
        });

        const pollQuestion = questionMessage.first().content;
        console.log("Poll Question:", pollQuestion);

        const options = [];
        await dmChannel.send(
          "Escreve as opções e dá 'enter' entre elas. Para terminar escreve 'stop' :"
        );

        while (true) {
          const optionMessage = await dmChannel.awaitMessages({
            filter,
            max: 1,
            time: 60000,
            errors: ["time"],
          });

          const option = optionMessage.first().content;

          if (option.toLowerCase() === "stop") {
            if (options.length < 2) {
              await dmChannel.send("Tens que inserir pelo menos duas opções.");
              continue;
            }
            break;
          }

          options.push(option);
        }

        let optionsLimit = 0;

        while (optionsLimit < 1 || optionsLimit > options.length) {
          await dmChannel.send(
            `Escolhe em quantas opções cada user pode votar (1-${options.length}):`
          );

          const limitMessage = await dmChannel.awaitMessages({
            filter,
            max: 1,
            time: 60000,
            errors: ["time"],
          });

          optionsLimit = parseInt(limitMessage.first().content);

          if (
            isNaN(optionsLimit) ||
            optionsLimit < 1 ||
            optionsLimit > options.length
          ) {
            await dmChannel.send(
              `Inválido. Escreve um número entre 1 e ${options.length}.`
            );
          }
        }

        console.log("Poll Options:", options);
        console.log("Options Limit:", optionsLimit);

        votes[pollQuestion] = {
          userVotes: {},
        };

        const channel = interaction.channel;
        const exampleEmbed = new EmbedBuilder()
          .setColor("White")
          .setTitle(pollQuestion)
          .setDescription(`Votem em ${optionsLimit} opções.`)
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

        const message = await channel.send({
          embeds: [exampleEmbed],
        });

        const optionButtons = options.map((option, index) => {
          return new ButtonBuilder()
            .setCustomId(index.toString())
            .setLabel(`${option} (${votes[pollQuestion][index]?.length || 0})`)
            .setStyle("Primary");
        });

        const rowComponents = [];
        let currentRow = new ActionRowBuilder();

        for (let i = 0; i < optionButtons.length; i++) {
          const button = optionButtons[i];

          if (currentRow.components.length === 5) {
            rowComponents.push(currentRow);
            currentRow = new ActionRowBuilder();
          }

          currentRow.addComponents(button);
        }

        if (currentRow.components.length > 0) {
          rowComponents.push(currentRow);
        }

        const rows = rowComponents.map((rowComponent) => {
          return new ActionRowBuilder().addComponents(
            ...rowComponent.components
          );
        });

        message.edit({
          embeds: [exampleEmbed],
          components: rows,
        });

        client.on("interactionCreate", async (buttonInteraction) => {
          if (
            buttonInteraction.isButton() &&
            buttonInteraction.message.id === message.id
          ) {
            const { customId, user } = buttonInteraction;
            console.log(`Voto adicionado em ${customId}`);

            const currentVotes = votes[pollQuestion][customId] || [];
            const userVotes = votes[pollQuestion].userVotes[user.id] || [];

            if (currentVotes.includes(user.id)) {
              // If the user has already voted for this option, remove their vote
              const voteIndex = currentVotes.indexOf(user.id);
              currentVotes.splice(voteIndex, 1);

              const userVoteIndex = userVotes.indexOf(customId);
              userVotes.splice(userVoteIndex, 1);

              await buttonInteraction.reply({
                content: "Voto removido.",
                ephemeral: true,
              });
            } else {
              if (userVotes.length >= optionsLimit) {
                await buttonInteraction.reply({
                  content: "Máximo de votos atingido.",
                  ephemeral: true,
                });
                return;
              }

              currentVotes.push(user.id);
              userVotes.push(customId);

              await buttonInteraction.reply({
                content: "Voto registado.",
                ephemeral: true,
              });
            }

            votes[pollQuestion][customId] = currentVotes;
            votes[pollQuestion].userVotes[user.id] = userVotes;

            optionButtons.forEach((button, index) => {
              const votesCount = votes[pollQuestion][index]?.length || 0;
              button.setLabel(`${options[index]} (${votesCount})`);
            });

            await message.edit({
              components: rows,
              embeds: [exampleEmbed],
            });
          }
        });
      } catch (error) {
        console.error(error);
        interaction.editReply("Erro a colectar a informação.");
      }
    }
  });
};
