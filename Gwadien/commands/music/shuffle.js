const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffle the queue")
  .setDMPermission(false)
  .setDefaultMemberPermissions(null),
  

   async run(interaction) {

   
    const queue = useQueue(interaction.guild.id);
    if(!queue || !queue.isPlaying()) return await interaction.reply("i don't play music right now.");
    if(queue.tracks.data.length < 2) return await interaction.reply(" i need 2 music in the queue for shuffle.");

    const voiceChannelMember = interaction.member.voice.channel;
    const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;
    if(!voiceChannelMember) return await interaction.followUp("I don't see you on a voice channel or maybe i'm blind ^^");
    if(voiceChannelBot && voiceChannelBot.id != voiceChannelMember.id) return await interaction.followUp("why are you trying to kidnap me? You not in the same voice channel than me. ");
    
    queue.tracks.shuffle();
    await interaction.reply("The queue has been successfully shuffled");


  }
};
