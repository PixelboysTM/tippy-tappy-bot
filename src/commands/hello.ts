import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "src/Command";

export const Hello: Command = {
    name: "hello",
    description: "Say hello to the world!",
    type: "CHAT_INPUT",
    ephemeral: true,
    defer: true,
    permisions: null,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = "Hello there!";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}

export const HelloEveryone: Command = {
    name: "hello_everyone",
    description: "Say hello to the world!",
    type: "CHAT_INPUT",
    ephemeral: false,
    defer: true,
    permisions: null,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = "Hello everyone!";

        await interaction.followUp({
            ephemeral: false,
            content
        });
    }
}