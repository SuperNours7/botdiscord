const { Events, InteractionType, PermissionsBitField } = require("discord.js");

module.exports = {

   name: Events.InteractionCreate,
   async run(client, interaction) {

      switch(interaction.type) {

         case InteractionType.ApplicationCommand:
            const command = client.commands.get(interaction.commandName);
            if(command.data.default_member_permissions && !interaction.member.permissions.has(new PermissionsBitField(command.data.default_member_permissions))) return await interaction.reply(`what are you trying to do ?\`${new PermissionsBitField(file.permission).toArray()}\` you don't have the permission little rascal`)
        await command.run(interaction);
        break;

        default:
            const name = interaction.customId.split("_")[0];
            const args = interaction.customId.split("_").slice(1);
            const file = client.interactions.find(i => i.name === name && i.type === interaction.componentType);
            if(!file) return;

            
            await file.run(interaction, ...args);
        break;
      }

     
   }  
}