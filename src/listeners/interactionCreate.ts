import { BaseCommandInteraction, Client } from "discord.js";
import { buttonEvents, modalEvents, selectMenuEvents } from "../Bot";
import { Commands } from "../Commands";

export default (client: Client): void => {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            await handleSlashCommand(client, interaction);
        }
        if (interaction.isButton()) {
            buttonEvents.trigger([interaction.customId, interaction]);
        }
        if (interaction.isModalSubmit()) {
            modalEvents.trigger([interaction.customId, interaction]);
        }
        if (interaction.isSelectMenu()) {
            selectMenuEvents.trigger([interaction.customId, interaction]);
        }
    });
}

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {

    const slashCommand = Commands.find(c => c.name === interaction.commandName);

    if (!slashCommand) {
        await interaction.reply({ ephemeral: true, content: "An error occurred." });
        return;
    }

    if (slashCommand.permisions && !interaction.memberPermissions?.has(slashCommand.permisions)) {
        await interaction.reply({ ephemeral: true, content: "You don't have permission to use this command." });
        return;
    }

    if (slashCommand.defer)
        await interaction.deferReply({ ephemeral: slashCommand.ephemeral });

    await slashCommand.run(client, interaction);
}