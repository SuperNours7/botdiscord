const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Get the bot latency")
  .setDMPermission(true)
  .setDefaultMemberPermissions(null),

   async run(interaction) {

    const button = new ActionRowBuilder().addComponents(new ButtonBuilder()
    .setCustomId("ping")
    .setEmoji("811261898360094730")
    .setLabel("Refresh")
    .setStyle(ButtonStyle.Secondary));

    await interaction.reply({content:`Ping : \`${interaction.client.ws.ping}ms\`.`, components: [button]});
  }
};
