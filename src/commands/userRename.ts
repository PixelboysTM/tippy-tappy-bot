import { ExecuteSQL } from "../saveHandler";
import { Command } from "../Command";

export const UserRename: Command = {
    name: "user_rename",
    description: "Change your tippy tappy nickname",
    type: "CHAT_INPUT",
    ephemeral: true,
    defer: true,
    permisions: null,
    options: [
        {
            name: "new_name",
            description: "The new nickname you want to use",
            type: "STRING",
            required: true,

        }
    ],
    run: async (client, interaction) => {
        let userID = interaction.user.id;
        let newName = interaction.options.get("new_name")?.value;
        ExecuteSQL(`UPDATE User SET name = "${newName}" WHERE discordid = "${userID}"`);
        interaction.followUp({
            content: "Your nickname has been changed to: " + newName,
        });
    }
}
