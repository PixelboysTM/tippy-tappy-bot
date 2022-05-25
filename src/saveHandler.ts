import { Database } from "sqlite3";

const db: Database = new Database("./database.sqlite");

export const InitDatabase = () => {
    db.serialize(
        () => {
            db.run("CREATE TABLE IF NOT EXISTS User (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name TEXT NOT NULL DEFAULT user, discordid TEXT(18) NOT NULL UNIQUE); ");
            db.run("CREATE TABLE IF NOT EXISTS Country ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, Name  TEXT(100) NOT NULL, flagIdentifier TEXT(2) NOT NULL, shortName TEXT(3) NOT NULL UNIQUE) ");
            db.run("CREATE TABLE IF NOT EXISTS Tournament  ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, name  TEXT NOT NULL, shortName TEXT(10) NOT NULL, startDate DATE NOT NULL, endDate DATE NOT NULL) ");
            db.run("CREATE TABLE IF NOT EXISTS Game  ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tournament  INTEGER NOT NULL, date DATETIME NOT NULL, player1 INTEGER NOT NULL, player2 INTEGER NOT NULL, from1 INTEGER, from2 INTEGER, FOREIGN KEY(tournament) REFERENCES Tournament(id), FOREIGN KEY(player1) REFERENCES Country(id), FOREIGN KEY(player2) REFERENCES Country(id), FOREIGN KEY(from1) REFERENCES Game(id), FOREIGN KEY(from2) REFERENCES Game(id));");
            db.run("CREATE TABLE IF NOT EXISTS Prediction ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tournament  INTEGER NOT NULL, game INTEGER NOT NULL, user INTEGER NOT NULL, score1 INTEGER NOT NULL, score2 INTEGER NOT NULL, FOREIGN KEY(tournament) REFERENCES Tournament(id), FOREIGN KEY(game) REFERENCES Game(id), FOREIGN KEY(user) REFERENCES User(id)); ");
            db.run("CREATE TABLE IF NOT EXISTS Result ( id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, tournament  INTEGER NOT NULL, game  INTEGER NOT NULL, winner INTEGER NOT NULL, score1 INTEGER NOT NULL, score2 INTEGER NOT NULL, FOREIGN KEY(tournament) REFERENCES Tournament(id), FOREIGN KEY(game) REFERENCES Game(id), FOREIGN KEY(winner) REFERENCES Country(id)); ");
        }
    );
}

export const CloseDatabase = () => {
    db.close();
}

export const ExecuteSQL = (sql: string): Promise<any[]> => {
    let result: any[] | undefined;
    return new Promise((resolve, reject) => {

        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }

            resolve(rows);
        })

    });
}