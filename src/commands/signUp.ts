import { BaseCommandInteraction, Client } from "discord.js";
import { modalEvents } from "../Bot";
import { Command } from "../Command";
import { ExecuteSQL } from "../saveHandler";

export const SignUp: Command = {
    name: "signup",
    description: "Sign up to participate in the next TippyTappy event.",
    type: "CHAT_INPUT",
    ephemeral: true,
    defer: false,
    permisions: null,
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        modalEvents.on(data => {
            if (data?.[0] === "tippytappy_signUpModal") {
                var name = data[1].fields.getTextInputValue("tippytappy_signUpModal_username");
                ExecuteSQL(`INSERT INTO User (name, discordid) VALUES ("${name}", "${data[1].user.id}")`);
                data[1].reply({
                    ephemeral: true,
                    content: "You registered as: " + name
                });
            }
        })

        await interaction.showModal({
            customId: "tippytappy_signUpModal",
            title: "Sign up for TippyTappy",
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            style: "SHORT",
                            type: "TEXT_INPUT",
                            label: "Username",
                            placeholder: "Nichname",
                            value: interaction.user.username,
                            required: true,
                            customId: "tippytappy_signUpModal_username",
                        }
                    ]
                }
            ]
        })
    }
}