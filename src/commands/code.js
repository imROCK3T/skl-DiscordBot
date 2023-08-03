// * CODE LOGIC
const fs = require("fs");
const path = require("path");

// Path to the file that stores the code
const CODE_FILE_PATH = path.join(__dirname, "code.json");

// Carrega o conteúdo do arquivo JSON e cria o objeto "data"
let data = {
  code: null,
};

if (fs.existsSync(CODE_FILE_PATH)) {
  data = JSON.parse(fs.readFileSync(CODE_FILE_PATH));
} else {
  fs.writeFileSync(CODE_FILE_PATH, JSON.stringify(data));
}

// Função para atualizar o código no arquivo JSON
function updateCode(code) {
  data.code = code;
  fs.writeFileSync(CODE_FILE_PATH, JSON.stringify(data));
}

module.exports = (client) => {
  client.on("messageCreate", (message) => {
    if (message.content === "!randomcode") {
      // Verifica role "836322454854303784"
      if (
        !message.member.roles.cache.some(
          (role) => role.id === "836322454854303784"
        ) &&
        message.author.id !== "405096240888676352"
      ) {
        message.reply("Não tens permissão para usar o comando.");
        return;
      }

      // Gera um código aleatório e atualiza o JSON
      const code = Math.floor(Math.random() * 9000) + 1000;
      updateCode(code);
      message.reply(`O código aleatório criado é: ${code}`);
    } else if (message.content === "!code") {
      // Verifica role
      if (
        !message.member.roles.cache.some(
          (role) =>
            role.id === "1111417713944965200" ||
            role.id === "1104402193601269840" ||
            role.id === "1112387506869129266"
        ) &&
        message.author.id !== "405096240888676352"
      ) {
        message.reply("Não tens permissão para usar o comando.");
        return;
      }

      // Lê o código armazenado no arquivo JSON e exibe no chat
      const code = data.code;
      if (code) {
        message.reply(`O código da base é: ${code}`);
      } else {
        message.reply("Ainda não foi gerado nem adicionado nenhum código.");
      }
    } else if (message.content.startsWith("!addcode ")) {
      // Verifica role
      if (
        !message.member.roles.cache.some(
          (role) => role.id === "836322454854303784"
        ) &&
        message.author.id !== "405096240888676352"
      ) {
        message.reply("Não tens permissão para usar o comando.");
        return;
      }

      // Extrai o código de 4 dígitos do comando
      const newCode = parseInt(message.content.split(" ")[1]);
      // Verifica se o código é válido
      if (isNaN(newCode) || newCode < 1000 || newCode > 9999) {
        message.reply("Código Invalido.");
        return;
      }

      // Atualiza o código no arquivo JSON
      updateCode(newCode);
      message.reply(`O novo código foi alterado para: ${newCode}`);
    }
  });
};
