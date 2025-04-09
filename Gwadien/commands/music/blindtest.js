const { useQueue, Playlist } = require("discord-player");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  
  data: new SlashCommandBuilder()
  .setName("blindtest")
  .setDescription("Start or stop a blindtest")
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand(opt => opt.setName("start").setDescription("Star a blindtest").addStringOption(opt => opt.setName("playlist").setDescription("The blindtest playlist").setRequired(true)))
  .addSubcommand(opt => opt.setName("stop").setDescription("Stop the blindtest")),
  

   async run(interaction) {


    const voiceChannelMember = interaction.member.voice.channel;
    const voiceChannelBot = (await interaction.guild.members.fetchMe()).voice.channel;
    if(!voiceChannelMember) return await interaction.followUp("I don't see you on a voice channel or maybe i'm blind ^^");
    if(voiceChannelBot && voiceChannelBot.id != voiceChannelMember.id) return await interaction.followUp("why are you trying to kidnap me? You not in the same voice channel than me. ");
    
    switch(interaction.options.getSubcommand()) {

        case "start" :
            if(interaction.client.bllindtests.get(interaction.guildId)) return await interaction.reply("There is already a blindtest on this server");

            await interaction.deferReply();
            const request = interaction.options.getString("playlist");

            await interaction.followUp("search for playlist...");

            const search = await interaction.client.player.search(request);
            if(!search._data.queryType.toLowerCase().includes("playlist")) return await interaction.followUp("You have to indicate a playlist")
      
            await interaction.editReply("Shuffling of the playlist...");
            search._data.playlist.tracks = search._data.playlist.tracks.sort((a, b) => 0.5 - Math.random());
        
            await interaction.editReply("Playing of the playlist...");

            const playlist = new Playlist(interaction.client.player, search._data.playlist);
            await playlist.play(voiceChannelMember, {
                requestedBy: interaction.user,
                nodeOptions: {
                    metadata: interaction,
                    volume: 70, 
                    leaveOnStop: false,
                    leaveOnEnd: false,
                    selfDeaf: true
        
                }});

                interaction.client.bllindtests.set(interaction.guildId, {
                    playlist: search._data.playlist.url,
                    channel: voiceChannelMember.id,
                    user: [],
                    count: 1,
                    author: interaction.user.id
                });
                await interaction.editReply(`${interaction.user} started a blindtest in <#${voiceChannelMember.id}>.`);
                await voiceChannelMember.send(`The blindtest starts ! Please send your reponse here that \` Singer - Track \` (example : \` Doja cat - Kiss Me More\`). Track : \`1/${playlist.tracks.length}\`.`);

                const filter = m => m.author.id !== interaction.user.id;
                const collector = voiceChannelMember.createMessageCollector({});

                collector.on("collect", async message => {

                    const queue = useQueue(interaction.guildId);
                    const singer = queue.history.currentTrack.author.toLowerCase().split(", ");
                    const part = message.content.split(" - ");

                    if(queue.history.currentTrack.title.toLowerCase().replace( /\(feat\. [^)]+\)/g, "") === part[1] && singer.every(a => part[0].split( /[,&]/g).map(s => s.trim()).includes(a))) {

                        const blindtest = interaction.client.blindtests.get(interaction.guildId);

                        if(blindtest.users.find(u => u.id === message.author.id)) blindtest.user.find(u => u.id === message.author.id).points++;
                        else blindtest.user.push({id: message.author.id, count: 1});
                        await message.reply(`${message.author} found the track, he win 1 point, he has \`${blindtest.users.find(u => u.id === message.author.id).points}\`point${blindtest.users.find(u => u.id === message.author.id)}`)
                        blindtest.count++;
                        if(blindtest.count > playlist.tracks.length) collector.stop();
                        else {
                            await voiceChannelMember.send(`Track \`${blindtest.count}/${playlist.tracks.length}\` Please send your reponse here that \` Singer - Track \` (example : \` Doja cat - Kiss Me More\`).\n${blindtest.users.sort((a, b) => b.points - a.points).slice(0, 10).map((u, index) => `\`${index+1}\`. ${interaction.client.users.cache.get(u.id)} => \`${u.points}\` point${u.points > 1 ? "s" : ""}`).join("\n")}.`);
                        }
                    }
                })
        }


  }
};
