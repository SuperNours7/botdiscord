const { ComponentType } = require("discord.js");

module.exports = {

    name: "ping",
    type: ComponentType.Button,

    async run(interaction) {

        await interaction.message.edit({content:`Ping : \`${interaction.client.ws.ping}ms\`.`});
        await interaction.deferUpdate();
    }
}