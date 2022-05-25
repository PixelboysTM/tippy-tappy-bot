import { BaseCommandInteraction, Client } from "discord.js";
import { buttonEvents } from "../Bot";
import { Command } from "../Command";

export const Button: Command = {
    name: "button",
    description: "A button",
    type: "CHAT_INPUT",
    ephemeral: true,
    defer: true,
    permisions: null,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        buttonEvents.on(data => {
            if (data?.[0] === "buttonCommandButton") {
                data[1].reply({
                    ephemeral: true,
                    content: "Yay!"
                });
            }
        });

        await interaction.followUp({
            ephemeral: true,
            content: "Lets press",
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            customId: "buttonCommandButton",
                            type: "BUTTON",
                            label: "Press me!",
                            style: "PRIMARY",
                        }
                    ]
                }
            ],
        });
    }
}