const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Mélange la file d’attente"),
  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction.member.voice.channel);
    if (!queue) {
      return interaction.reply("❌ La file d'attente est vide.");
    }
    queue.shuffle();
    await interaction.reply("🔀 File d'attente mélangée !");
  },
};
