import { Command } from "./Command";
import { AdminPanel } from "./commands/adminPanel";
import { ListCountries } from "./commands/listCountries";
import { ListTournament } from "./commands/listTournament";
import { SignUp } from "./commands/signUp";
import { UserRename } from "./commands/userRename";

export const Commands: Command[] = [SignUp, AdminPanel, ListCountries, ListTournament, UserRename];