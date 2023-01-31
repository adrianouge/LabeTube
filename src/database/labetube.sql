-- Active: 1675180192047@@127.0.0.1@3306

CREATE TABLE videos(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    upload_date TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
);

DROP TABLE videos