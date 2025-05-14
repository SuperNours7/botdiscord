const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("back")
    .setDescription("Revient à la musique précédente"),
  async execute(interaction, distube) {
    try {
      await distube.previous(interaction.member.voice.channel);
      await interaction.reply("⏮️ Revenu à la musique précédente !");
    } catch (error) {
      console.error(error);
      await interaction.reply(
        "❌ Impossible de revenir à la musique précédente."
      );
    }
  },
};
