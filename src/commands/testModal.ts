import { modalEvents } from "../Bot";
import { Command } from "../Command";


export const TestModal: Command = {
    name: "test_modal",
    description: "A test modal",
    type: "CHAT_INPUT",
    ephemeral: true,
    defer: false,
    permisions: null,
    run: async (client, interaction) => {
        modalEvents.on(data => {
            if (data?.[0] === "testModal") {
                data[1].reply({
                    ephemeral: true,
                    content: "You typed: " + data[1].fields.getTextInputValue("textInputInputTestModal")
                });
            }

        })

        await interaction.showModal({
            customId: "testModal",
            title: "Test Modal",
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            style: "SHORT",
                            type: "TEXT_INPUT",
                            label: "Text input",
                            placeholder: "Placeholder",
                            value: "",
                            required: true,
                            customId: "textInputInputTestModal",
                        }
                    ]
                }
            ]
        });
    }
}