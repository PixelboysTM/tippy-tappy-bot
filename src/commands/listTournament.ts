import { ExecuteSQL } from "../saveHandler";
import { Command } from "../Command";
import { BaseCommandInteraction, TextBasedChannel } from "discord.js";

export const ListTournament: Command = {
    name: "list_tournaments",
    description: "List all tournaments that exist for tippy tappy",
    type: "CHAT_INPUT",
    ephemeral: true,
    defer: true,
    permisions: null,
    options: [
        {
            name: "show_public",
            description: "Show tournaments for all users",
            type: "BOOLEAN",
            required: false,
        }
    ],
    run: async (client, interaction: BaseCommandInteraction) => {
        let publicOption = interaction.options.get("show_public")?.value ?? false;

        ExecuteSQL("SELECT * FROM Tournament;").then(result => {

            let str = "Here are all the tournaments that exist for tippy tappy:\n**---**\n";
            result.forEach(row => {
                var start = new Date(row.startDate);
                var end = new Date(row.endDate);
                str += " **-** `" + row.name + "` **(" + row.shortName + ")** `" + row.startDate + "` - `" + row.endDate + "` " + ((start.getTime() <= Date.now() && Date.now() <= end.getTime()) ? ":white_check_mark:" : ":negative_squared_cross_mark:") + "\n";
            });
            str += "**---**";

            if (!publicOption) {
                interaction.followUp({
                    ephemeral: true,
                    content: str,
                })
            } else {
                interaction.followUp({
                    ephemeral: true,
                    content: "Showing all tournaments for all users!",
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