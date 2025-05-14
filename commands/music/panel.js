const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Affiche les boutons de contrôle de la musique"),

  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("music_play")
        .setLabel("▶️ Play")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("music_pause")
        .setLabel("⏸️ Pause")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("music_skip")
        .setLabel("⏭️ Skip")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("music_stop")
        .setLabel("⏹️ Stop")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      content: "🎵 Interface de contrôle de la musique :",
      components: [row],
    });
  },
};
