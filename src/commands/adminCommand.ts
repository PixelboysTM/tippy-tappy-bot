import { Command } from "../Command";
import { BaseCommandInteraction, PermissionFlags, PermissionString } from "discord.js";

export const AdminCommand: Command = {
    name: "admin_command",
    description: "A command that can be only used by admins",
    type: "CHAT_INPUT",
    ephemeral: true,
    defer: true,
    permisions: ['ADMINISTRATOR'],
    run: async (client, interaction: BaseCommandInteraction) => {
        await interaction.followUp({
            ephemeral: true,
            content: "You are an admin!"
        });
    }
}