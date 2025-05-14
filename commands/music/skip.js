const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Passe à la musique suivante"),
  async execute(interaction, distube) {
    try {
      await distube.skip(interaction.member.voice.channel);
      await interaction.reply("⏭️ Musique suivante !");
    } catch (error) {
      console.error(error);
      await interaction.reply("❌ Impossible de passer à la musique suivante.");
    }
  },
};
