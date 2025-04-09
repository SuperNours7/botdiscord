const { readdirSync } = require("fs");

module.exports = client => {
    
    let count = 0;
    const dirsInteractions = readdirSync("./Interactions/");

    for(const dirs of dirsInteractions) {
        const filesDirs = readdirSync(`./Interactions/${dirs}/`).filter(f => f.endsWith(".js"));
        for(const files of filesDirs) {
            const interaction = require(`../interactions/${dirs}/${files}`);
            client.interactions.set(interaction.name, interaction);
            count++;
        }
    };

    console.log(`[Interactions] => ${count} loaded interactions`)
}