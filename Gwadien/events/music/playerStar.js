module.exports = {

    name: "playerStart",
    async run(client, queue, track) {

       if(client.blindtests.get(queue.metadata.channel.guildId)?.playlist === track.playlist?.url) return;
      await queue.metadata.channel.send(`The music \`${track.title}\` during \`${track.duration}\` requested by \`${track.requestedBy.username}\`is playing :)`)
    }
};