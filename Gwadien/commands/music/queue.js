const { useQueue, QueueRepeatMode } = require("discord-player");
const { SlashCommandBuilder, Embed, EmbedBuilder } = require("discord.js");
const Pagination = require("../../classes/Pagination");

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Get information of the queue")
  .setDMPermission(false)
  .setDefaultMemberPermissions(null),
  

   async run(interaction) {


    await interaction.deferReply();
   
    const queue = useQueue(interaction.guild.id);
    if(!queue || !queue.isPlaying()) return await interaction.followUp("i don't play music right now.");
    if(!queue.history.nextTrack) return await interaction.followUp("There isn't music after this music.");
    const tracks = queue.history.tracks.data.filter(t => interaction.client.blindtests.get(interaction.guildID)?.playlist !== t.playlist?.url);
    if(tracks.length < 1) return await interaction.followUp("There isn't music after this music.");

    const embeds = [];
    for(let i = 0; i < tracks.length; i++) {
        const embed = new EmbedBuilder()
        .setColor(interaction.client.color)
        .setTitle(`Music n°${i+1}`)
        .setTimestamp()
        .setFooter({text: `${interaction.client.user.username}`, iconURL: interaction.client.user.displayAvatarURL()});
        embeds.push(embed);
    };

    const pagination = new Pagination(embeds, (embed, index) => embed.setThumbnail(tracks[index].thumbnail).setDescription(`Loop : ${queue.repeatMode === QueueRepeatMode.QUEUE ? "queue" : queue.repeatMode === QueueRepeatMode.TRACK ? "track" : "off"}\n\nTrack : \`${tracks[index].title}\`\nDuration : \`${tracks[index].duration}\`\nAuthor : \`${tracks[index].author}\`\nViews : \`${tracks[index].views}\`\nRequested by : ${interaction.client.users.cache.get(tracks[index].requestedBy.id)}\nPlaylist : \`${tracks[index].playlist ? "yes" : "no"}\``))
    await pagination.reply(interaction);
  }
};
