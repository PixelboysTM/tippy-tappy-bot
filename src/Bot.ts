import { BaseCommandInteraction, ButtonInteraction, Client, ModalSubmitInteraction, SelectMenuInteraction } from 'discord.js';
import ready from './listeners/ready';
import interactionCreate from './listeners/interactionCreate';
import { LiteEvent } from "./liteEvent";
import { InitDatabase } from './saveHandler';
import { token } from './token';

console.log("Bot is starting...");

export var buttonEvents = new LiteEvent<[string, ButtonInteraction]>();
export var modalEvents = new LiteEvent<[string, ModalSubmitInteraction]>();
export var selectMenuEvents = new LiteEvent<[string, SelectMenuInteraction]>();

const client = new Client({
    intents: []
});

InitDatabase();

ready(client);
interactionCreate(client);

client.login(token);

