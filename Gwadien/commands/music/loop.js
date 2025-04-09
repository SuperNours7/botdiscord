const { useQueue, QueueRepeatMode } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName("loop")
  .setDescription("loop the track")
  .setDMPermission(false)
  .setDefaultMemberPermissions(null)
  .addStringOption(opt => opt.setName("option").setDescription("The thing to loop").setRequired(true).addChoices({name:"track", value:"track"}, {name: "queue", value: "queue"})),
  

   async run(interaction) {

   
    const queue = useQueue(interaction.guild.id);
    if(!queue || !queue.isPlaying()) return await interaction.reply("i don't play music right now.");
    if(queue.history.nextTrack) return await interaction.reply("there isn't music after this music.");

    const voiceChannelMember = interaction.member.voice.channel;
    const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;
    if(!voiceChannelMember) return await interaction.followUp("I don't see you on a voice channel or maybe i'm blind ^^");
    if(voiceChannelBot && voiceChannelBot.id != voiceChannelMember.id) return await interaction.followUp("why are you trying to kidnap me? You not in the same voice channel than me. ");
    
    const option = interaction.options.getString("option");
    if(option !== "track" && option !== "queue") return await interaction.reply("You have to indacated\`queue\` or \`track\`.");

    switch(option) {

        case "track" :
            if(queue.repeatMode === 0) {
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                await interaction.reply(`The loop on the track has been set up succefully`);
            } else {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                await interaction.reply(`The loop on the track has been remove succefully`);
            }
        break;    

        case "queue" :
            if(queue.repeatMode === 0) {
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                await interaction.reply(`The loop on the queue has been set up succefully`);
            } else {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                await interaction.reply(`The loop on the queue has been remove succefully`);
            }
    }


  }
};
