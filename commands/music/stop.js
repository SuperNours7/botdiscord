const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Arrête la musique"),
  async execute(interaction, distube) {
    try {
      await distube.stop(interaction.member.voice.channel);
      await interaction.reply("⏹️ Musique arrêtée !");
    } catch (error) {
      console.error(error);
      await interaction.reply("❌ Impossible d'arrêter la musique.");
    }
  },
};
