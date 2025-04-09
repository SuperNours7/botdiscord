const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause or resume the music")
  .setDMPermission(false)
  .setDefaultMemberPermissions(null),
  

   async run(interaction) {

   
    const queue = useQueue(interaction.guild.id);
    if(!queue || !queue.isPlaying()) return await interaction.reply("i don't play music right now.");
    

    const voiceChannelMember = interaction.member.voice.channel;
    const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;
    if(!voiceChannelMember) return await interaction.followUp("I don't see you on a voice channel or maybe i'm blind ^^");
    if(voiceChannelBot && voiceChannelBot.id != voiceChannelMember.id) return await interaction.followUp("why are you trying to kidnap me? You not in the same voice channel than me. ");
    
    if(queue.node.isPaused()) {

        queue.node.resume();
        await interaction.reply(`The music is resumed.`);

    } else {

        queue.node.pause();
        await interaction.reply(`The music is paused.`);
    }


  }
};
