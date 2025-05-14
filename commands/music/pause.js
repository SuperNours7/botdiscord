const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Met en pause la musique"),
  async execute(interaction, distube) {
    try {
      await distube.pause(interaction.member.voice.channel);
      await interaction.reply("⏸️ Musique mise en pause !");
    } catch (error) {
      console.error(error);
      await interaction.reply("❌ Impossible de mettre la musique en pause.");
    }
  },
};
