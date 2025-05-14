const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Joue une musique depuis YouTube")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Nom ou URL de la musique")
        .setRequired(true)
    ),

  async execute(interaction, distube) {
    const query = interaction.options.getString("query");

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content:
          "❌ Vous devez être dans un salon vocal pour utiliser cette commande !",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    try {
      await distube.play(interaction.member.voice.channel, query, {
        member: interaction.member,
        textChannel: interaction.channel,
      });

      await interaction.editReply({
        content: `🎶 Lecture de : **${query}**`,
      });
    } catch (error) {
      console.error("Erreur lors de la lecture de la musique :", error);
      await interaction.editReply({
        content: `❌ Une erreur est survenue : ${error.message}`,
      });
    }
  },
};
