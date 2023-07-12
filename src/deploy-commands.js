// * SLASH COMMAND REGISTER

require("dotenv").config();

const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "evento",
    description: "Criar um evento de Sim, Não, Talvez",
  },
  {
    name: "poll",
    description: "Criar votação com o número de opções pretendida.",
  },

  {
    name: "monumentos",
    description: "Criar votação de monumentos.",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Regestiring slash commands");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
        process.env.CLIENT_ID
      ),
      { body: commands }
    );

    console.log("slash commands were registered");
  } catch (error) {
    console.log(`There was an error :${error}`);
  }
})();
