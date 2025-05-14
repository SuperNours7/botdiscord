const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Reprend la musique"),
  async execute(interaction, distube) {
    try {
      await distube.resume(interaction.member.voice.channel);
      await interaction.reply("▶️ Musique reprise !");
    } catch (error) {
      console.error(error);
      await interaction.reply("❌ Impossible de reprendre la musique.");
    }
  },
};
