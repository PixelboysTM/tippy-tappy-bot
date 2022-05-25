import { BaseCommandInteraction, Client, MessageActionRow, MessageButton, MessageEmbed, Modal, ModalActionRowComponent, TextInputComponent, EmbedAuthorData, Emoji, MessageSelectMenu, MessageSelectOptionData } from "discord.js";
import { buttonEvents, modalEvents, selectMenuEvents } from "../Bot";
import { ExecuteSQL } from "../saveHandler";
import { Command } from "../Command";

export const AdminPanel: Command = {
    name: "admin_panel",
    description: "Opens the tippy tappy admin panel.",
    type: "CHAT_INPUT",
    ephemeral: true,
    defer: true,
    permisions: ['ADMINISTRATOR'],
    run: async (client: Client, interaction: BaseCommandInteraction) => {

        //Buttons
        buttonEvents.on(data => {
            let eventName = data?.[0];
            let interaction = data?.[1];

            //Country Buttons
            if (eventName === "buttonCommandAdminPanelAddCountry") {
                interaction?.showModal(
                    new Modal()
                        .setCustomId("adminPanelAddCountryModal")
                        .setTitle("Create New Country")
                        .addComponents(
                            new MessageActionRow<ModalActionRowComponent>().addComponents(
                                new TextInputComponent()
                                    .setCustomId("adminPanelAddCountryModalNameInput")
                                    .setLabel("Country Name")
                                    .setStyle("SHORT")
                                    .setPlaceholder("Germany")
                                    .setRequired(true)
                            ),
                            new MessageActionRow<ModalActionRowComponent>().addComponents(
                                new TextInputComponent()
                                    .setCustomId("adminPanelAddCountryModalFlagIdentifierInput")
                                    .setLabel("Flag Identifier")
                                    .setStyle("SHORT")
                                    .setPlaceholder("DE")
                                    .setMinLength(2)
                                    .setMaxLength(2)
                                    .setRequired(true)
                            ),
                            new MessageActionRow<ModalActionRowComponent>().addComponents(
                                new TextInputComponent()
                                    .setCustomId("adminPanelAddCountryModalShortNameInput")
                                    .setLabel("Short Name")
                                    .setStyle("SHORT")
                                    .setMaxLength(3)
                                    .setPlaceholder("GER")
                                    .setRequired(true)
                            )
                        )
                )
            }
            if (eventName === "buttonCommandAdminPanelModifyCountry") {
                let countries = ExecuteSQL("SELECT * FROM Country").then(
                    data => {
                        let options: MessageSelectOptionData[] = [];
                        data.forEach(country => {
                            options.push({
                                label: country.Name,
                                value: country.id.toString(),
                                description: country.shortName,
                                emoji: client.emojis.cache.find(emoji => emoji.name === "flag_" + country.flagIdentifier)
                            });
                        });

                        interaction?.reply({
                            ephemeral: true,
                            content: "Select a country to modify",
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        new MessageSelectMenu()
                                            .setCustomId("adminPanelModifyCountrySelectCountryMenu")
                                            .setPlaceholder(data[0].Name)
                                            .addOptions(options)
                                    ]
                                },
                            ]
                        });
                    }
                );


            }
            if (eventName === "buttonCommandAdminPanelDeleteCountry") {
                let countries = ExecuteSQL("SELECT * FROM Country").then(
                    data => {
                        let options: MessageSelectOptionData[] = [];
                        data.forEach(country => {
                            options.push({
                                label: country.Name,
                                value: country.id.toString(),
                                description: country.shortName,
                                emoji: client.emojis.cache.find(emoji => emoji.name === "flag_" + country.flagIdentifier)
                            });
                        });


                        interaction?.reply({
                            ephemeral: true,
                            content: "Select a Country to delete",
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        new MessageSelectMenu()
                                            .setCustomId("adminPanelDeleteCountrySelectCountryMenu")
                                            .setPlaceholder(data[0].Name)
                                            .addOptions(options)
                                    ]
                                },
                            ]
                        });
                    }
                );
            }
            if (eventName === "adminPanelDeleteCountryConfirmButton") {
                let id = parseInt(interaction?.message.content.split("__")[1] ?? "");
                ExecuteSQL("DELETE FROM Country WHERE id = " + id + ";").then(() => interaction?.update({ content: "Delete Successful", components: [] }));
            }
            if (eventName === "adminPanelDeleteCountryCancelButton") {
                interaction?.update({ content: "Delete Canceled", components: [] });
            }

            //Tournament Buttons
            if (eventName === "buttonCommandAdminPanelAddTournament") {
                interaction?.showModal(
                    new Modal()
                        .setCustomId("adminPanelAddTournamentModal")
                        .setTitle("Create New Tournament")
                        .addComponents(
                            new MessageActionRow<ModalActionRowComponent>().addComponents(
                                new TextInputComponent()
                                    .setCustomId("adminPanelAddTournamentModalNameInput")
                                    .setLabel("Tournament Name")
                                    .setStyle("SHORT")
                                    .setPlaceholder("Weltmesiterschaft")
                                    .setRequired(true)
                            ),
                            new MessageActionRow<ModalActionRowComponent>().addComponents(
                                new TextInputComponent()
                                    .setCustomId("adminPanelAddTournamentModalShortNameInput")
                                    .setLabel("Tournament short Name")
                                    .setStyle("SHORT")
                                    .setPlaceholder("wm")
                                    .setRequired(true)
                                    .setMaxLength(10)
                            ),
                            new MessageActionRow<ModalActionRowComponent>().addComponents(
                                new TextInputComponent()
                                    .setCustomId("adminPanelAddTournamentModalStartDateInput")
                                    .setLabel("Tournament start Date")
                                    .setStyle("SHORT")
                                    .setPlaceholder("YYYY-MM-DD")
                                    .setRequired(true)
                                    .setMinLength(10)
                                    .setMaxLength(10)
                            ),
                            new MessageActionRow<ModalActionRowComponent>().addComponents(
                                new TextInputComponent()
                                    .setCustomId("adminPanelAddTournamentModalEndDateInput")
                                    .setLabel("Tournament end Date")
                                    .setStyle("SHORT")
                                    .setPlaceholder("YYYY-MM-DD")
                                    .setRequired(true)
                                    .setMinLength(10)
                                    .setMaxLength(10)
                            )
                        )
                );
            }
            if (eventName === "buttonCommandAdminPanelModifyTournament") {
                let tournaments = ExecuteSQL("SELECT * FROM Tournament").then(
                    data => {
                        let options: MessageSelectOptionData[] = [];
                        data.forEach(tournament => {
                            options.push({
                                label: tournament.name,
                                value: tournament.id.toString(),
                                description: tournament.shortName,
                            });
                        });

                        interaction?.reply({
                            ephemeral: true,
                            content: "Select a tournament to modify",
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        new MessageSelectMenu()
                                            .setCustomId("adminPanelModifyTournamentSelectTournamentMenu")
                                            .setPlaceholder(data[0].name)
                                            .addOptions(options)
                                    ]
                                },
                            ]
                        });
                    })
            }
            if (eventName === "buttonCommandAdminPanelDeleteTournament") {
                let tournaments = ExecuteSQL("SELECT * FROM Tournament").then(
                    data => {
                        let options: MessageSelectOptionData[] = [];
                        data.forEach(tournament => {
                            options.push({
                                label: tournament.name,
                                value: tournament.id.toString(),
                                description: tournament.shortName,
                            });
                        });

                        interaction?.reply({
                            ephemeral: true,
                            content: "Select a tournament to delete",
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        new MessageSelectMenu()
                                            .setCustomId("adminPanelDeleteTournamentSelectTournamentMenu")
                                            .setPlaceholder(data[0].name)
                                            .addOptions(options)
                                    ]
                                },
                            ]
                        });
                    })
            }
            if (eventName === "adminPanelDeleteTournamentConfirmButton") {
                let id = parseInt(interaction?.message.content.split("__")[1] ?? "");
                ExecuteSQL("DELETE FROM Tournament WHERE id = " + id + ";").then(() => interaction?.update({ content: "Delete Successful", components: [] }));
            }
            if (eventName === "adminPanelDeleteTournamentCancelButton") {
                interaction?.update({ content: "Delete Canceled", components: [] });
            }

            //Game Buttons
            if (eventName === "buttonCommandAdminPanelAddGame") {
                interaction?.showModal({
                    customId: "adminPanelAddGameModal",
                    title: "Create New Game",
                    components: [
                        new MessageActionRow<ModalActionRowComponent>().addComponents(
                            new TextInputComponent()
                                .setCustomId("adminPanelAddGameModalNameInput")
                                .setLabel("Game Name")
                                .setStyle("SHORT")
                                .setRequired(true)
                        ),
                        new MessageActionRow<ModalActionRowComponent>().addComponents(
                            new TextInputComponent()
                                .setCustomId("adminPanelAddGameModalDateInput")
                                .setLabel("Game Datetime")
                                .setStyle("SHORT")
                                .setPlaceholder("YYYY-MM-DD HH:MM")
                                .setRequired(true)
                                .setMinLength(16)
                                .setMaxLength(16)
                        ),
                    ]
                });
            }
            if (eventName === "adminPanelAddGameCancelProcessButton") {
                interaction?.update({ content: "Add Game Canceled", components: [], embeds: [] });
            }
            if (eventName === "adminPanelAddGameConfirmProcessButton") {
                let name = interaction?.message?.embeds?.[0].fields?.[0].value ?? "";
                let datetime = interaction?.message?.embeds?.[0].fields?.[1].value ?? "";
                let tournament = parseInt(interaction?.message?.embeds?.[0].fields?.[2].value.split("__")[1] ?? "");
                let player1 = parseInt(interaction?.message?.embeds?.[0].fields?.[3].value.split("__")[1] ?? "");
                let player2 = parseInt(interaction?.message?.embeds?.[0].fields?.[4].value.split("__")[1] ?? "");
                let from1 = parseInt(interaction?.message?.embeds?.[0].fields?.[5].value.split("__")[1] ?? "");
                let from2 = parseInt(interaction?.message?.embeds?.[0].fields?.[6].value.split("__")[1] ?? "");
                ExecuteSQL(`INSERT INTO GAME (name, date, tournament, player1, player2, from1, from2) VALUES ("${name}", "${datetime}", ${tournament}, ${player1}, ${player2}, ${from1 == -1 ? "NULL" : from1.toString()}, ${from2 == -1 ? "NULL" : from2.toString()});`).then(() => interaction?.update({ content: "Added Game Successful", components: [], embeds: [] }));
            }
            if (eventName === "buttonCommandAdminPanelModifyGame") {
                interaction?.reply({
                    ephemeral: true,
                    content: "Modifying Games not yet implemented",
                });
            }
            if (eventName === "buttonCommandAdminPanelDeleteGame") {
                let tournaments = ExecuteSQL("SELECT * FROM Game").then(
                    data => {
                        let options: MessageSelectOptionData[] = [];
                        data.forEach(game => {
                            options.push({
                                label: game.name,
                                value: game.id.toString(),
                            });
                        });

                        interaction?.reply({
                            ephemeral: true,
                            content: "Select a Game to delete",
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        new MessageSelectMenu()
                                            .setCustomId("adminPanelDeleteGameSelectGameMenu")
                                            .setPlaceholder("Select Game")
                                            .addOptions(options)
                                    ]
                                },
                            ]
                        });
                    })
            }
            if (eventName === "adminPanelDeleteGameConfirmProcessButton") {
                let id = parseInt(interaction?.message.content.split("__")[1] ?? "");
                ExecuteSQL("DELETE FROM Game WHERE id = " + id + ";").then(() => interaction?.update({ content: "Delete Successful", components: [] }));
            }
            if (eventName === "adminPanelDeleteGameCancelProcessButton") {
                interaction?.update({ content: "Delete Canceled", components: [] });
            }
        });

        //Modals
        modalEvents.on(data => {
            let eventName = data?.[0];
            let interaction = data?.[1];

            //Country Modals
            if (eventName === "adminPanelAddCountryModal") {
                let name = interaction?.fields.getTextInputValue("adminPanelAddCountryModalNameInput") ?? "";
                let flagIdentifier = interaction?.fields.getTextInputValue("adminPanelAddCountryModalFlagIdentifierInput") ?? "";
                let shortName = interaction?.fields.getTextInputValue("adminPanelAddCountryModalShortNameInput") ?? "";
                ExecuteSQL(`INSERT INTO Country (name, flagIdentifier, shortName) VALUES ("${name}", "${flagIdentifier}", "${shortName}")`);
                let avatarUrl: string = interaction?.user.avatarURL() ?? "";
                let botUrl = interaction?.client.user?.avatarURL() ?? "";
                interaction?.reply({
                    ephemeral: true,
                    content: "You created a new country: ",
                    embeds: [
                        new MessageEmbed()
                            .setColor("#ff7e08")
                            .setTitle("Country:")
                            .setAuthor({ name: interaction.user.username, url: undefined, iconURL: avatarUrl })
                            .setDescription("A new Country was added with following Properties")
                            .setThumbnail(botUrl)
                            .addField("Name:", name)
                            .addField("Flag: ", ":flag_" + flagIdentifier + ":")
                            .addField("Short Name:", shortName)
                            .setTimestamp()
                            .setFooter({ text: "Tippy Tappy Bot", iconURL: botUrl })
                    ]
                });
            }
            if (eventName === "adminPanelModifyCountryModal") {
                let name = interaction?.fields.getTextInputValue("adminPanelModifyCountryModalNameInput") ?? "";
                let flagIdentifier = interaction?.fields.getTextInputValue("adminPanelModifyCountryModalFlagIdentifierInput") ?? "";
                let shortName = interaction?.fields.getTextInputValue("adminPanelModifyCountryModalShortNameInput") ?? "";
                let countryId = parseInt(interaction?.fields.getTextInputValue("adminPanelModifyCountryModalShortIdInput") ?? "");
                ExecuteSQL(`UPDATE Country SET Name = "${name}", flagIdentifier = "${flagIdentifier}", shortName = "${shortName}" WHERE id = ${countryId}`);
                let avatarUrl: string = interaction?.user.avatarURL() ?? "";
                let botUrl = interaction?.client.user?.avatarURL() ?? "";
                interaction?.reply({
                    ephemeral: true,
                    content: "You updated a country: ",
                    embeds: [
                        new MessageEmbed()
                            .setColor("#ff7e08")
                            .setTitle("Country:")
                            .setAuthor({ name: interaction.user.username, url: undefined, iconURL: avatarUrl })
                            .setDescription("The Country has now the following Properties")
                            .setThumbnail(botUrl)
                            .addField("Name:", name)
                            .addField("Flag: ", ":flag_" + flagIdentifier + ":")
                            .addField("Short Name:", shortName)
                            .setTimestamp()
                            .setFooter({ text: "Tippy Tappy Bot", iconURL: botUrl })
                    ]
                });
            }

            //Tournament Modals
            if (eventName === "adminPanelAddTournamentModal") {
                let name = interaction?.fields.getTextInputValue("adminPanelAddTournamentModalNameInput") ?? "";
                let shortName = interaction?.fields.getTextInputValue("adminPanelAddTournamentModalShortNameInput") ?? "";
                let startDate = interaction?.fields.getTextInputValue("adminPanelAddTournamentModalStartDateInput") ?? "";
                let endDate = interaction?.fields.getTextInputValue("adminPanelAddTournamentModalEndDateInput") ?? "";
                ExecuteSQL(`INSERT INTO Tournament (name, shortName, startDate, endDate) VALUES ("${name}", "${shortName}", "${startDate}", "${endDate}")`);
                let avatarUrl: string = interaction?.user.avatarURL() ?? "";
                let botUrl = interaction?.client.user?.avatarURL() ?? "";
                interaction?.reply({
                    ephemeral: true,
                    content: "You created a new tournament: ",
                    embeds: [
                        new MessageEmbed()
                            .setColor("#ff7e08")
                            .setTitle("Tournament:")
                            .setAuthor({ name: interaction.user.username, url: undefined, iconURL: avatarUrl })
                            .setDescription("A new Tournament was added with following Properties")
                            .setThumbnail(botUrl)
                            .addField("Name:", name)
                            .addField("Short Name:", shortName)
                            .addField("Start Date:", startDate)
                            .addField("End Date:", endDate)
                            .setTimestamp()
                            .setFooter({ text: "Tippy Tappy Bot", iconURL: botUrl })
                    ]
                });
            }
            if (eventName === "adminPanelModifyTournamentModal") {
                let name = interaction?.fields.getTextInputValue("adminPanelModifyTournamentModalNameInput") ?? "";
                let shortName = interaction?.fields.getTextInputValue("adminPanelModifyTournamentModalShortNameInput") ?? "";
                let startDate = interaction?.fields.getTextInputValue("adminPanelModifyTournamentModalStartDateInput") ?? "";
                let endDate = interaction?.fields.getTextInputValue("adminPanelModifyTournamentModalEndDateInput") ?? "";
                let tournamentId = parseInt(interaction?.fields.getTextInputValue("adminPanelModifyTournamentModalShortIdInput") ?? "");
                ExecuteSQL(`UPDATE Tournament SET Name = "${name}", shortName = "${shortName}", startDate = "${startDate}", endDate = "${endDate}" WHERE id = ${tournamentId}`);
                let avatarUrl: string = interaction?.user.avatarURL() ?? "";
                let botUrl = interaction?.client.user?.avatarURL() ?? "";
                interaction?.reply({
                    ephemeral: true,
                    content: "You updated a tournament: ",
                    embeds: [
                        new MessageEmbed()
                            .setColor("#ff7e08")
                            .setTitle("Tournament:")
                            .setAuthor({ name: interaction.user.username, url: undefined, iconURL: avatarUrl })
                            .setDescription("The Tournament has now the following Properties")
                            .setThumbnail(botUrl)
                            .addField("Name:", name)
                            .addField("Short Name:", shortName)
                            .addField("Start Date:", startDate)
                            .addField("End Date:", endDate)
                            .setTimestamp()
                            .setFooter({ text: "Tippy Tappy Bot", iconURL: botUrl })
                    ]
                });
            }

            //Game Modals
            if (eventName === "adminPanelAddGameModal") {
                let name = interaction?.fields.getTextInputValue("adminPanelAddGameModalNameInput") ?? "";
                let datetime = interaction?.fields.getTextInputValue("adminPanelAddGameModalDateInput") ?? "";
                ExecuteSQL("SELECT * FROM Tournament").then(
                    data => {
                        let options: MessageSelectOptionData[] = [];
                        data.forEach(tournament => {
                            options.push({
                                label: tournament.name,
                                value: tournament.id.toString(),
                                description: tournament.shortName,
                            });
                        });

                        interaction?.reply({
                            ephemeral: true,
                            content: "Select the tournament the game belongs to:",
                            embeds: [
                                new MessageEmbed()
                                    .setColor("#ff7e08")
                                    .setTitle("Create New Game")
                                    .addFields(
                                        { name: "Name", value: name, inline: false },
                                        { name: "Datetime", value: datetime, inline: true },
                                    )
                                    .setImage(client.user?.avatarURL() ?? "")
                                    .setTimestamp()
                                    .setFooter({ text: "Game blueprint", iconURL: (client.user?.avatarURL() ?? "") })
                            ],
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        new MessageSelectMenu()
                                            .setCustomId("adminPanelAddGameSelectTournamentMenu")
                                            .setPlaceholder("Select a tournament")
                                            .addOptions(options)
                                    ]
                                },
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        new MessageButton()
                                            .setCustomId("adminPanelAddGameCancelProcessButton")
                                            .setLabel("Cancel")
                                            .setStyle("SECONDARY")
                                            .setEmoji(":x:")
                                    ]
                                }
                            ]
                        })
                    }
                );
            }
        });

        //Select Menus
        selectMenuEvents.on(data => {
            let eventName = data?.[0];
            let interaction = data?.[1];

            //Country Select Menus
            if (eventName === "adminPanelModifyCountrySelectCountryMenu") {
                let countryId = parseInt(interaction?.values[0] ?? "0");
                ExecuteSQL(`SELECT * FROM Country WHERE id = ${countryId}`).then(
                    (country) => {
                        interaction?.showModal(
                            new Modal()
                                .setCustomId("adminPanelModifyCountryModal")
                                .setTitle("Modify Country " + country[0].id)
                                .addComponents(
                                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                                        new TextInputComponent()
                                            .setCustomId("adminPanelModifyCountryModalNameInput")
                                            .setLabel("Country Name")
                                            .setStyle("SHORT")
                                            .setPlaceholder("Germany")
                                            .setRequired(true)
                                            .setValue(country[0].Name.toString())
                                    ),
                                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                                        new TextInputComponent()
                                            .setCustomId("adminPanelModifyCountryModalFlagIdentifierInput")
                                            .setLabel("Flag Identifier")
                                            .setStyle("SHORT")
                                            .setPlaceholder("DE")
                                            .setRequired(true)
                                            .setMinLength(2)
                                            .setMaxLength(2)
                                            .setValue(country[0].flagIdentifier.toString())
                                    ),
                                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                                        new TextInputComponent()
                                            .setCustomId("adminPanelModifyCountryModalShortNameInput")
                                            .setLabel("Short Name")
                                            .setStyle("SHORT")
                                            .setPlaceholder("GER")
                                            .setRequired(true)
                                            .setMaxLength(3)
                                            .setValue(country[0].shortName.toString())
                                    ),
                                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                                        new TextInputComponent()
                                            .setCustomId("adminPanelModifyCountryModalShortIdInput")
                                            .setLabel("Id DO NOT CHANGE")
                                            .setStyle("SHORT")
                                            .setPlaceholder("0")
                                            .setRequired(true)
                                            .setValue(country[0].id.toString())
                                    )
                                )
                        );
                    });
            }
            if (eventName === "adminPanelDeleteCountrySelectCountryMenu") {
                let countryId = parseInt(interaction?.values[0] ?? "0");
                ExecuteSQL(`SELECT * FROM Country WHERE id = ${countryId}`).then(
                    (country) => {
                        interaction?.update(
                            {
                                content: "Are you sure you want to delete the Country: " + country[0].Name + "? __" + country[0].id,
                                components: [
                                    {
                                        type: "ACTION_ROW",
                                        components: [
                                            new MessageButton()
                                                .setCustomId("adminPanelDeleteCountryConfirmButton")
                                                .setLabel("Yes")
                                                .setStyle("DANGER"),
                                            new MessageButton()
                                                .setCustomId("adminPanelDeleteCountryCancelButton")
                                                .setLabel("No")
                                                .setStyle("SECONDARY")
                                        ]
                                    }
                                ]
                            }
                        );
                    });
            }

            //Tournament Select Menus
            if (eventName === "adminPanelModifyTournamentSelectTournamentMenu") {
                let tournamentId = parseInt(interaction?.values[0] ?? "0");
                ExecuteSQL(`SELECT * FROM Tournament WHERE id = ${tournamentId}`).then(
                    (tournament) => {
                        interaction?.showModal(
                            new Modal()
                                .setCustomId("adminPanelModifyTournamentModal")
                                .setTitle("Modify Tournament " + tournament[0].id)
                                .addComponents(
                                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                                        new TextInputComponent()
                                            .setCustomId("adminPanelModifyTournamentModalNameInput")
                                            .setLabel("Tournament Name")
                                            .setStyle("SHORT")
                                            .setPlaceholder("Tournament 1")
                                            .setRequired(true)
                                            .setValue(tournament[0].name.toString())
                                    ),
                                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                                        new TextInputComponent()
                                            .setCustomId("adminPanelModifyTournamentModalShortNameInput")
                                            .setLabel("Short Name")
                                            .setStyle("SHORT")
                                            .setPlaceholder("T1")
                                            .setRequired(true)
                                            .setMaxLength(10)
                                            .setValue(tournament[0].shortName.toString())
                                    ),
                                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                                        new TextInputComponent()
                                            .setCustomId("adminPanelModifyTournamentModalStartDateInput")
                                            .setLabel("Start Date")
                                            .setStyle("SHORT")
                                            .setPlaceholder("YYYY-MM-DD")
                                            .setRequired(true)
                                            .setValue(tournament[0].startDate.toString())
                                    ),
                                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                                        new TextInputComponent()
                                            .setCustomId("adminPanelModifyTournamentModalEndDateInput")
                                            .setLabel("End Date")
                                            .setStyle("SHORT")
                                            .setPlaceholder("YYYY-MM-DD")
                                            .setRequired(true)
                                            .setValue(tournament[0].endDate.toString())
                                    ),
                                    new MessageActionRow<ModalActionRowComponent>().addComponents(
                                        new TextInputComponent()
                                            .setCustomId("adminPanelModifyTournamentModalShortIdInput")
                                            .setLabel("Id DO NOT CHANGE")
                                            .setStyle("SHORT")
                                            .setPlaceholder("0")
                                            .setRequired(true)
                                            .setValue(tournament[0].id.toString())
                                    )
                                )
                        );
                    });
            }
            if (eventName === "adminPanelDeleteTournamentSelectTournamentMenu") {
                let tournamentId = parseInt(interaction?.values[0] ?? "0");
                ExecuteSQL(`SELECT * FROM Tournament WHERE id = ${tournamentId}`).then(
                    (tournament) => {
                        interaction?.update(
                            {
                                content: "Are you sure you want to delete the Tournament: " + tournament[0].name + "? __" + tournament[0].id,
                                components: [
                                    {
                                        type: "ACTION_ROW",
                                        components: [
                                            new MessageButton()
                                                .setCustomId("adminPanelDeleteTournamentConfirmButton")
                                                .setLabel("Yes")
                                                .setStyle("DANGER"),
                                            new MessageButton()
                                                .setCustomId("adminPanelDeleteTournamentCancelButton")
                                                .setLabel("No")
                                                .setStyle("SECONDARY")
                                        ]
                                    }
                                ]
                            }
                        );
                    });
            }

            //Game Select Menus
            if (eventName === "adminPanelAddGameSelectTournamentMenu") {
                let tournamentId = parseInt(interaction?.values[0] ?? "0");
                ExecuteSQL(`SELECT * FROM Tournament WHERE id = ${tournamentId}`).then(
                    (tournament) => {
                        ExecuteSQL("SELECT * FROM Country").then(
                            data => {
                                let options: MessageSelectOptionData[] = [];
                                data.forEach(country => {
                                    options.push({
                                        label: country.Name,
                                        value: country.id.toString(),
                                        description: country.shortName,
                                    });
                                });

                                let name = interaction?.message?.embeds?.[0].fields?.[0].value ?? "";
                                let datetime = interaction?.message?.embeds?.[0].fields?.[1].value ?? "";

                                interaction?.update({
                                    content: "Select the first Country competing in the game:",
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor("#ff7e08")
                                            .setTitle("Create New Game")
                                            .addFields(
                                                { name: "Name", value: name, inline: false },
                                                { name: "Date", value: datetime, inline: false },
                                                { name: "Tournament", value: tournament[0].name + " __" + tournament[0].id, inline: false },
                                            )
                                            .setImage(client.user?.avatarURL() ?? "")
                                            .setTimestamp()
                                            .setFooter({ text: "Game blueprint", iconURL: (client.user?.avatarURL() ?? "") })
                                    ],
                                    components: [
                                        {
                                            type: "ACTION_ROW",
                                            components: [
                                                new MessageSelectMenu()
                                                    .setCustomId("adminPanelAddGameSelectPlayer1Menu")
                                                    .setPlaceholder("Select Player 1")
                                                    .addOptions(options)
                                            ]
                                        },
                                        {
                                            type: "ACTION_ROW",
                                            components: [
                                                new MessageButton()
                                                    .setCustomId("adminPanelAddGameCancelProcessButton")
                                                    .setLabel("Cancel")
                                                    .setStyle("SECONDARY")
                                                    .setEmoji(":x:")
                                            ]
                                        }
                                    ]
                                })
                            }
                        );
                    }
                );
            }
            if (eventName === "adminPanelAddGameSelectPlayer1Menu") {
                let player1Id = parseInt(interaction?.values[0] ?? "0");
                ExecuteSQL(`SELECT * FROM Country WHERE id = ${player1Id}`).then(
                    (player1) => {
                        ExecuteSQL("SELECT * FROM Country").then(
                            data => {
                                let options: MessageSelectOptionData[] = [];
                                data.forEach(country => {
                                    options.push({
                                        label: country.Name,
                                        value: country.id.toString(),
                                        description: country.shortName,
                                    });
                                });

                                let name = interaction?.message?.embeds?.[0].fields?.[0].value ?? "";
                                let datetime = interaction?.message?.embeds?.[0].fields?.[1].value ?? "";
                                let tournament = interaction?.message?.embeds?.[0].fields?.[2].value ?? "";

                                interaction?.update({
                                    content: "Select the second Country competing in the game:",
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor("#ff7e08")
                                            .setTitle("Create New Game")
                                            .addFields(
                                                { name: "Name", value: name, inline: false },
                                                { name: "Date", value: datetime, inline: false },
                                                { name: "Tournament", value: tournament, inline: false },
                                                { name: "Player 1", value: player1[0].Name + " __" + player1[0].id, inline: false },
                                            )
                                            .setImage(client.user?.avatarURL() ?? "")
                                            .setTimestamp()
                                            .setFooter({ text: "Game blueprint", iconURL: (client.user?.avatarURL() ?? "") })
                                    ],
                                    components: [
                                        {
                                            type: "ACTION_ROW",
                                            components: [
                                                new MessageSelectMenu()
                                                    .setCustomId("adminPanelAddGameSelectPlayer2Menu")
                                                    .setPlaceholder("Select Player 2")
                                                    .addOptions(options)
                                            ]
                                        },
                                        {
                                            type: "ACTION_ROW",
                                            components: [
                                                new MessageButton()
                                                    .setCustomId("adminPanelAddGameCancelProcessButton")
                                                    .setLabel("Cancel")
                                                    .setStyle("SECONDARY")
                                                    .setEmoji(":x:")
                                            ]
                                        }
                                    ]
                                })
                            }
                        );
                    }
                );
            }
            if (eventName === "adminPanelAddGameSelectPlayer2Menu") {
                let player2Id = parseInt(interaction?.values[0] ?? "0");
                ExecuteSQL(`SELECT * FROM Country WHERE id = ${player2Id}`).then(
                    (player2) => {
                        ExecuteSQL("SELECT * FROM Game").then(
                            data => {
                                let options: MessageSelectOptionData[] = [];
                                options.push({
                                    label: "No Game",
                                    value: "-1",
                                    description: "No prior Game to Country1",
                                });
                                data.forEach(game => {
                                    options.push({
                                        label: game.name,
                                        value: game.id.toString(),
                                        description: game.date,
                                    });
                                });

                                let name = interaction?.message?.embeds?.[0].fields?.[0].value ?? "";
                                let datetime = interaction?.message?.embeds?.[0].fields?.[1].value ?? "";
                                let tournament = interaction?.message?.embeds?.[0].fields?.[2].value ?? "";
                                let player1 = interaction?.message?.embeds?.[0].fields?.[3].value ?? "";

                                interaction?.update({
                                    content: "Select the optional Game that resulted in this first Country:",
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor("#ff7e08")
                                            .setTitle("Create New Game")
                                            .addFields(
                                                { name: "Name", value: name, inline: false },
                                                { name: "Date", value: datetime, inline: false },
                                                { name: "Tournament", value: tournament, inline: false },
                                                { name: "Player 1", value: player1, inline: false },
                                                { name: "Player 2", value: player2[0].Name + " __" + player2[0].id, inline: false },
                                            )
                                            .setImage(client.user?.avatarURL() ?? "")
                                            .setTimestamp()
                                            .setFooter({ text: "Game blueprint", iconURL: (client.user?.avatarURL() ?? "") })
                                    ],
                                    components: [
                                        {
                                            type: "ACTION_ROW",
                                            components: [
                                                new MessageSelectMenu()
                                                    .setCustomId("adminPanelAddGameSelectFrom1Menu")
                                                    .setPlaceholder("Select From 1")
                                                    .addOptions(options)
                                            ]
                                        },
                                        {
                                            type: "ACTION_ROW",
                                            components: [
                                                new MessageButton()

                                                    .setCustomId("adminPanelAddGameCancelProcessButton")
                                                    .setLabel("Cancel")
                                                    .setStyle("SECONDARY")
                                                    .setEmoji(":x:")
                                            ]

                                        }
                                    ]
                                }
                                );
                            }
                        );
                    }
                );
            }
            if (eventName === "adminPanelAddGameSelectFrom1Menu") {
                let from1Id = parseInt(interaction?.values[0] ?? "0");
                ExecuteSQL(`SELECT * FROM Game WHERE id = ${from1Id}`).then(
                    (from1) => {
                        ExecuteSQL("SELECT * FROM Game").then(
                            data => {
                                let options: MessageSelectOptionData[] = [];
                                options.push({
                                    label: "No Game",
                                    value: "-1",
                                    description: "No prior Game to Country2",
                                });
                                data.forEach(game => {
                                    options.push({
                                        label: game.name,
                                        value: game.id.toString(),
                                        description: game.date,
                                    });
                                });

                                let name = interaction?.message?.embeds?.[0].fields?.[0].value ?? "";
                                let datetime = interaction?.message?.embeds?.[0].fields?.[1].value ?? "";
                                let tournament = interaction?.message?.embeds?.[0].fields?.[2].value ?? "";
                                let player1 = interaction?.message?.embeds?.[0].fields?.[3].value ?? "";
                                let player2 = interaction?.message?.embeds?.[0].fields?.[4].value ?? "";
                                let from1_data = from1.length == 0 ? "No prior Game __-1" : from1[0].name + " __" + from1[0].id;

                                interaction?.update({
                                    content: "Select the optional Game that resulted in this second Country:",
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor("#ff7e08")
                                            .setTitle("Create New Game")
                                            .addFields(
                                                { name: "Name", value: name, inline: false },
                                                { name: "Date", value: datetime, inline: false },
                                                { name: "Tournament", value: tournament, inline: false },
                                                { name: "Player 1", value: player1, inline: false },
                                                { name: "Player 2", value: player2, inline: false },
                                                { name: "From 1", value: from1_data, inline: false },
                                            )
                                            .setImage(client.user?.avatarURL() ?? "")
                                            .setTimestamp()
                                            .setFooter({ text: "Game blueprint", iconURL: (client.user?.avatarURL() ?? "") })
                                    ],
                                    components: [
                                        {
                                            type: "ACTION_ROW",
                                            components: [
                                                new MessageSelectMenu()
                                                    .setCustomId("adminPanelAddGameSelectFrom2Menu")
                                                    .setPlaceholder("Select From 2")
                                                    .addOptions(options)
                                            ]
                                        },
                                        {
                                            type: "ACTION_ROW",
                                            components: [
                                                new MessageButton()
                                                    .setCustomId("adminPanelAddGameCancelProcessButton")
                                                    .setLabel("Cancel")
                                                    .setStyle("SECONDARY")
                                                    .setEmoji(":x:")
                                            ]
                                        }
                                    ]
                                });
                            }
                        );
                    }
                );
            }
            if (eventName === "adminPanelAddGameSelectFrom2Menu") {
                let from2Id = parseInt(interaction?.values[0] ?? "0");
                ExecuteSQL(`SELECT * FROM Game WHERE id = ${from2Id}`).then(
                    (from2) => {
                        let name = interaction?.message?.embeds?.[0].fields?.[0].value ?? "";
                        let datetime = interaction?.message?.embeds?.[0].fields?.[1].value ?? "";
                        let tournament = interaction?.message?.embeds?.[0].fields?.[2].value ?? "";
                        let player1 = interaction?.message?.embeds?.[0].fields?.[3].value ?? "";
                        let player2 = interaction?.message?.embeds?.[0].fields?.[4].value ?? "";
                        let from1 = interaction?.message?.embeds?.[0].fields?.[5].value ?? "";
                        let from2_data = from2.length == 0 ? "No prior Game __-1" : from2[0].name + " __" + from2[0].id;

                        interaction?.update({
                            content: "Confirm Values for new Game:",
                            embeds: [
                                new MessageEmbed()
                                    .setColor("#ff7e08")
                                    .setTitle("Create New Game")
                                    .addFields(
                                        { name: "Name", value: name, inline: false },
                                        { name: "Date", value: datetime, inline: false },
                                        { name: "Tournament", value: tournament, inline: false },
                                        { name: "Player 1", value: player1, inline: false },
                                        { name: "Player 2", value: player2, inline: false },
                                        { name: "From 1", value: from1, inline: false },
                                        { name: "From 2", value: from2_data, inline: false },
                                    )
                                    .setImage(client.user?.avatarURL() ?? "")
                                    .setTimestamp()
                                    .setFooter({ text: "Game blueprint", iconURL: (client.user?.avatarURL() ?? "") })
                            ],
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        new MessageButton()
                                            .setCustomId("adminPanelAddGameConfirmProcessButton")
                                            .setLabel("Confirm")
                                            .setStyle("PRIMARY")
                                    ]
                                },
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        new MessageButton()

                                            .setCustomId("adminPanelAddGameCancelProcessButton")
                                            .setLabel("Cancel")
                                            .setStyle("SECONDARY")
                                            .setEmoji(":x:")
                                    ]
                                }
                            ]
                        });
                    });
            }
            if (eventName === "adminPanelDeleteGameSelectGameMenu") {
                let gameId = parseInt(interaction?.values[0] ?? "0");
                ExecuteSQL(`SELECT * FROM Game WHERE id = ${gameId}`).then(
                    (game) => {
                        interaction?.update({
                            content: "Are you sure you want to delete this Game: " + game[0].name + "? __" + game[0].id,
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        new MessageButton()
                                            .setCustomId("adminPanelDeleteGameConfirmProcessButton")
                                            .setLabel("Confirm")
                                            .setStyle("PRIMARY"),
                                        new MessageButton()
                                            .setCustomId("adminPanelDeleteGameCancelProcessButton")
                                            .setLabel("Cancel")
                                            .setStyle("SECONDARY")
                                            .setEmoji(":x:")

                                    ]
                                }]

                        });
                    });
            }
        });

        await interaction?.followUp({
            ephemeral: true,
            content: "Tippy Tappy admin panel",
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelUnused1")
                            .setLabel("Country:")
                            .setStyle("SECONDARY")
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelAddCountry")
                            .setLabel("Add Country")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelModifyCountry")
                            .setLabel("Modify Country")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelDeleteCountry")
                            .setLabel("Delete Country")
                            .setStyle("PRIMARY"),

                    ]
                },
                {
                    type: "ACTION_ROW",
                    components: [
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelUnused2")
                            .setLabel("Tournament:")
                            .setStyle("SECONDARY")
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelAddTournament")
                            .setLabel("Add Tournament")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelModifyTournament")
                            .setLabel("Modify Tournament")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelDeleteTournament")
                            .setLabel("Delete Tournament")
                            .setStyle("PRIMARY"),
                    ]
                },
                {
                    type: "ACTION_ROW",
                    components: [
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelUnused3")
                            .setLabel("Game:")
                            .setStyle("SECONDARY")
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelAddGame")
                            .setLabel("Add Game")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelModifyGame")
                            .setLabel("Modify Game")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId("buttonCommandAdminPanelDeleteGame")
                            .setLabel("Delete Game")
                            .setStyle("PRIMARY"),
                    ]
                }
            ]
        });
    }
}