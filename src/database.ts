import { Client } from "pg";

const connection = new Client({
    user: "postgres",
    password: "12345",
    host: "localhost",
    database: "postgres",
    port: 5432
});

export const openConnection = async () => {
    await connection.connect();

    console.log("Connection opened");
}

export const closeConnection = async () => {
    await connection.end();

    console.log("Connection was closed");
}