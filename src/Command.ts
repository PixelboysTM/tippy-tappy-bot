import { BaseCommandInteraction, ChatInputApplicationCommandData, Client, PermissionFlags, Permissions, PermissionString } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    ephemeral: boolean;
    defer: boolean;
    permisions: PermissionString[] | null;
    run: (client: Client, interaction: BaseCommandInteraction) => void;
}