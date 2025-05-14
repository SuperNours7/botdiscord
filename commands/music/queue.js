const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Affiche la file d'attente actuelle"),

  async execute(interaction, distube) {
    const queue = distube.getQueue(interaction.guildId);

    if (!queue || !queue.songs.length) {
      return interaction.reply("❌ La file d'attente est vide.");
    }

    const current = queue.songs[0];
    const upcoming = queue.songs.slice(1, 11); // max 10 suivants

    const embed = new EmbedBuilder()
      .setTitle("🎶 File d’attente actuelle")
      .setThumbnail(current.thumbnail)
      .addFields(
        {
          name: "▶️ En cours",
          value: `[${current.name}](${current.url}) — \`${current.formattedDuration}\` *(demandé par ${current.user.username})*`,
        },
        {
          name: "⏭️ À venir",
          value:
            upcoming.length > 0
              ? upcoming
                  .map(
                    (s, i) =>
                      `**${i + 1}.** [${s.name}](${s.url}) — \`${
                        s.formattedDuration
                      }\` *(par ${s.user.username})*`
                  )
                  .join("\n")
              : "Aucune autre musique dans la file.",
        }
      )
      .setColor("Blue");

    await interaction.reply({ embeds: [embed] });
  },
};
