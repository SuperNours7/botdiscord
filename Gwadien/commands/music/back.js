const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName("back")
  .setDescription("Return to the previous music")
  .setDMPermission(false)
  .setDefaultMemberPermissions(null),
  

   async run(interaction) {

   
    const queue = useQueue(interaction.guild.id);
    if(!queue || !queue.isPlaying()) return await interaction.reply("i don't play music right now.");
    if(!queue.history.previousTrack) return await interaction.reply("There isn't music before this music.");

    const voiceChannelMember = interaction.member.voice.channel;
    const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;
    if(!voiceChannelMember) return await interaction.followUp("I don't see you on a voice channel or maybe i'm blind ^^");
    if(voiceChannelBot && voiceChannelBot.id != voiceChannelMember.id) return await interaction.followUp("why are you trying to kidnap me? You not in the same voice channel than me. ");
    
    await queue.history.back();
    await interaction.reply(`The music \`${queue.history.currentTrack.title}\` is back.`);


  }
};
