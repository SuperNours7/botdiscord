require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const fs = require("node:fs");
const path = require("node:path");
const ffmpegPath = path.join(__dirname, "ffmpeg", "bin", "ffmpeg.exe");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandItems = fs.readdirSync(foldersPath);

for (const item of commandItems) {
  const itemPath = path.join(foldersPath, item);
  const isDirectory = fs.statSync(itemPath).isDirectory();

  if (isDirectory) {
    const commandFiles = fs
      .readdirSync(itemPath)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const filePath = path.join(itemPath, file);
      loadCommand(filePath);
    }
  } else if (item.endsWith(".js")) {
    loadCommand(itemPath);
  }
}

function loadCommand(filePath) {
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing required "data" or "execute" property.`
    );
  }
}

const distube = new DisTube(client, {
  emitNewSongOnly: true,
  plugins: [new YtDlpPlugin()],
  ffmpeg: ffmpegPath,
});
console.log(`✅ FFmpeg trouvé à : ${ffmpegPath}`);
console.log(`FFmpeg path: ${ffmpegPath}`);

distube
  .on("playSong", async (queue, song) => {
    const embed = new EmbedBuilder()
      .setTitle("\ud83c\udfb6 Lecture en cours")
      .setDescription(`[${song.name}](${song.url})`)
      .addFields(
        {
          name: "\ud83d\udcfa Chaîne",
          value: song.uploader.name,
          inline: true,
        },
        { name: "⏱️ Durée", value: song.formattedDuration, inline: true },
        {
          name: "\ud83d\udc64 Demandé par",
          value: `${song.user}`,
          inline: true,
        }
      )
      .setThumbnail(song.thumbnail)
      .setColor("Random");

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("back")
        .setLabel("⏮️")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("pause_resume")
        .setLabel("⏸️/▶️")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("skip")
        .setLabel("⏭️")
        .setStyle(ButtonStyle.Secondary)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("shuffle")
        .setLabel("🔀")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("loop")
        .setLabel("🔁")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("stop")
        .setLabel("⏹️")
        .setStyle(ButtonStyle.Danger)
    );

    await queue.textChannel.send({ embeds: [embed], components: [row1, row2] });

    // Affichage de la file d'attente
    if (queue.songs.length > 1) {
      const queueEmbed = new EmbedBuilder()
        .setTitle("📜 File d'attente")
        .setDescription(
          queue.songs
            .slice(1, 11)
            .map(
              (s, i) =>
                `**${i + 1}.** [${s.name}](${s.url}) — \`${
                  s.formattedDuration
                }\` *(${s.user.username})*`
            )
            .join("\n")
        )
        .setColor("Blue");

      await queue.textChannel.send({ embeds: [queueEmbed] });
    }
  })
  .on("addSong", (queue, song) => {
    queue.textChannel.send(`➕ Ajouté à la file d'attente : **${song.name}**`);
  })
  .on("finish", (queue) => {
    queue.textChannel.send("✅ La file d'attente est terminée !");
  })
  .on("error", (channel, error) => {
    console.error(error);
    channel.send("❌ Une erreur est survenue !");
  });

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, distube);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "❌ Une erreur est survenue lors de l'exécution de la commande.",
        ephemeral: true,
      });
    }
  } else if (interaction.isButton()) {
    const { customId } = interaction;
    const queue = distube.getQueue(interaction.guildId);

    if (!queue && customId !== "stop") {
      return interaction.reply({
        content: "❌ Aucune musique en cours.",
        ephemeral: true,
      });
    }

    try {
      switch (customId) {
        case "back":
          if (queue.previousSongs.length === 0) {
            await interaction.reply({
              content: "⚠️ Aucun morceau précédent.",
              ephemeral: true,
            });
          } else {
            queue.previous();
            await interaction.reply({
              content: "⏮️ Morceau précédent.",
              ephemeral: true,
            });
          }
          break;

        case "pause_resume":
          if (queue.paused) {
            queue.resume();
            await interaction.reply({
              content: "▶️ Lecture reprise.",
              ephemeral: true,
            });
          } else {
            queue.pause();
            await interaction.reply({
              content: "⏸️ Lecture en pause.",
              ephemeral: true,
            });
          }
          break;
        case "skip":
          if (queue.songs.length <= 1) {
            await interaction.reply({
              content: "⚠️ Il n'y a pas de morceau suivant à passer.",
              ephemeral: true,
            });
          } else {
            queue.skip();
            await interaction.reply({
              content: "⏭️ Morceau suivant.",
              ephemeral: true,
            });
          }
          break;

        case "shuffle":
          queue.shuffle();
          await interaction.reply({
            content: "🔀 File d'attente mélangée.",
            ephemeral: true,
          });
          break;
        case "loop":
          const mode = queue.setRepeatMode((queue.repeatMode + 1) % 3);
          const modeText = [
            "❌ Boucle désactivée",
            "🔂 Boucle sur le morceau",
            "🔁 Boucle sur la file",
          ];
          await interaction.reply({ content: modeText[mode], ephemeral: true });
          break;
        case "stop":
          queue.stop();
          await interaction.reply({
            content: "⏹️ Musique arrêtée.",
            ephemeral: true,
          });
          break;
        default:
          await interaction.reply({
            content: "❓ Bouton inconnu.",
            ephemeral: true,
          });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Erreur lors du traitement du bouton.",
        ephemeral: true,
      });
    }
  }
});

client.once("ready", () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

(async () => {
  const { REST, Routes } = require("discord.js");
  const commands = [];

  for (const command of client.commands.values()) {
    commands.push(command.data.toJSON());
  }

  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("⏳ Enregistrement des commandes slash...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("✅ Commandes enregistrées avec succès.");
  } catch (error) {
    console.error("❌ Erreur en enregistrant les commandes slash:", error);
  }
})();

client.login(process.env.DISCORD_TOKEN);
