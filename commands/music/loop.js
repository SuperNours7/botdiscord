const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Active ou désactive la répétition"),
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction.member.voice.channel);
    if (!queue) {
      return interaction.reply("❌ La file d'attente est vide.");
    }
    queue.setRepeatMode(queue.repeatMode === 0 ? 1 : 0);
    await interaction.reply(
      `🔁 Répétition ${queue.repeatMode === 0 ? "désactivée" : "activée"} !`
    );
  },
};
