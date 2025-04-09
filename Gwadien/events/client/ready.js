const { Events, ActivityType} = require("discord.js");

module.exports = {

    name: Events.ClientReady,
    async run(client) {

        console.log(client.commands)
        await client.application.commands.set(client.commands.map(command => command.data));
        console.log("[Interactions] => loaded");
        client.user.setActivity("Les Gwadiens^^", {type: ActivityType.Watching}); 

        console.log(`${client.user.username} is online`);
    }
};