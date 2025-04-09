const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName("setvolume")
  .setDescription("Set the music volume")
  .setDMPermission(false)
  .setDefaultMemberPermissions(null)
  .addNumberOption(opt => opt.setName("volume").setDescription("The required volume").setRequired(true).setMaxValue(200).setMinValue(1)),

   async run(interaction) {

   
    const queue = useQueue(interaction.guild.id);
    if(!queue || !queue.isPlaying()) return await interaction.reply("i don't play music right now.");
    

    const voiceChannelMember = interaction.member.voice.channel;
    const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;
    if(!voiceChannelMember) return await interaction.followUp("I don't see you on a voice channel or maybe i'm blind ^^");
    if(voiceChannelBot && voiceChannelBot.id != voiceChannelMember.id) return await interaction.followUp("why are you trying to kidnap me? You not in the same voice channel than me. ");
    
    const volume = interaction.options.getNumber("volume");
    if(queue.node.volume === volume) return await interaction.reply(`The volume is already to \`${queue.node.volume}%\`.`);

    await interaction.reply(`The volume went from \`${queue.node.volume}%\` to \`${volume}%\`.`);
    queue.node.setVolume(volume);

  }
};
