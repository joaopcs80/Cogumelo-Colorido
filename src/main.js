const { Client, Intents } = require('discord.js');
const fetch = require('node-fetch');

const token = 'TOKEN DO BOT AQUI'
const prefix = '!'

const base_url = 'ROTA GET DA API DE ONDE SERÃO PUXADOS OS DADOS';

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES];

const bot = new Client({ 
  intents: intents
});

const updateInterval = 60000; // 1 minuto

bot.on('ready', () => {
  console.log(`Bot está pronto como ${bot.user.tag}`);
  setInterval(updateBotStatus, updateInterval);
  updateBotStatus(); // Atualiza imediatamente após o bot estar pronto
});

async function updateBotStatus() {
  const url = `${base_url}/get_status`;

  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const serverStatus = await response.json();
      const { dias, season, players, max_players, online } = serverStatus;

      let statusText = 'Servidor Offline';
      if (online) {
        statusText = `Online: ${players}/${max_players} jogadores | ${dias} dias, Estação: ${season}`;
      }

      bot.user.setActivity(statusText, { type: 'PLAYING' });
    } else {
      console.log('Erro ao atualizar o status do bot.');
    }
  } catch (error) {
    console.error('Erro ao atualizar o status do bot:', error);
  }
}

bot.on('messageCreate', (message) => {
  if (message.author.bot) return; // Evitar responder a outros bots

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
      message.reply('Pong!');
    }
  }
});

bot.login(token);

module.exports = (req, res) => {
  res.end('Bot is running');
};
