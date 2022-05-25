import { ExecuteSQL } from "../saveHandler";
import { Command } from "../Command";
import { TextBasedChannel } from "discord.js";

export const ListCountries: Command = {
    name: "list_countries",
    description: "List all countries that exist for tippy tappy",
    type: "CHAT_INPUT",
    ephemeral: true,
    defer: true,
    permisions: null,
    options: [
        {
            name: "show_public",
            description: "Show countries for all users",
            type: "BOOLEAN",
            required: false,
        }
    ],
    run: async (client, interaction) => {
        let publicOption = interaction.options.get("show_public")?.value ?? false;
        ExecuteSQL("SELECT * FROM Country;").then(result => {
            let str = "Here are all the Countries that exist for tippy tappy:\n**---**\n";
            result.forEach(row => {
                str += " **-** `" + row.Name + "` :flag_" + row.flagIdentifier + ": **(**`" + row.shortName + "`**)**\n";
            });
            str += "**---**";

            if (!publicOption) {
                interaction.followUp({
                    ephemeral: true,
                    content: str,
                });
            } else {
                interaction.followUp({
                    ephemeral: true,
                    content: "Showing all Countries for all users!",
                }).then(() => {
                    const guild = interaction.guild;
                    client?.channels.fetch(interaction.channelId.toString()).then(c => {
                        const channel: TextBasedChannel = c as TextBasedChannel;
                        channel?.send(str);
                    });
                });
            }
        })
    }
}