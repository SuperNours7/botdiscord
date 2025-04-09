const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a music")
  .setDMPermission(false)
  .setDefaultMemberPermissions(null)
  .addStringOption(opt => opt.setName("song").setDescription("The song to play").setRequired(true)),

   async run(interaction) {

    await interaction.deferReply({ephemeral: true});
    const song = interaction.options.getString("song");

    const voiceChannelMember = interaction.member.voice.channel;
    const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;
    if(!voiceChannelMember) return await interaction.followUp("I don't see you on a voice channel or maybe i'm blind ^^");
    if(voiceChannelBot && voiceChannelBot.id != voiceChannelMember.id) return await interaction.followUp("why are you trying to kidnap me? You not in the same voice channel than me. ");
    
try {


    const { track } = await interaction.client.player.play(voiceChannelMember, song, {
        requestedBy: interaction.user,
        nodeOptions: {
            metadata: interaction,
            volume: 70, 
            leaveOnStop: false,
            leaveOnEnd: false,
            selfDeaf: true,

        }
    });

    await interaction.followUp(`\`${track.title}\` during \`${track.duration}\` is added to the queue`);

} catch (err) {

    return await interaction.followUp(`the thing \`${song}\` you have me looking for doesn't exist-_-`)
}

  }
};
