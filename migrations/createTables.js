import mysql from 'mysql2';
require('dotenv').config();

const connection = null;
await setTimeout(
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    })
, 20000);


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL server.');

    const createDatabase = `
        CREATE DATABASE IF NOT EXISTS rererer;
    `;

    connection.query(createDatabase, (err, results) => {
        if (err) {
            console.error('Error creating database:', err);
            return connection.end(); // Close connection on error
        }
        console.log('Database "TestTask" created or already exists.');

        connection.query('USE TestTask;', (err) => {
            if (err) {
                console.error('Error selecting database:', err);
                return connection.end(); // Close connection on error
            }

            const createItemsTable = `
                CREATE TABLE IF NOT EXISTS items (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    label VARCHAR(255) NOT NULL
                );
            `;

            const createCombinationsTable = `
                CREATE TABLE IF NOT EXISTS combinations (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    combination JSON NOT NULL
                );
            `;

            const createResponsesTable = `
                CREATE TABLE IF NOT EXISTS responses (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    response JSON NOT NULL
                );
            `;

            // Create tables in sequence
            connection.query(createItemsTable, (err, results) => {
                if (err) {
                    console.error('Error creating items table:', err);
                } else {
                    console.log('Items table created successfully.');
                }

                connection.query(createCombinationsTable, (err, results) => {
                    if (err) {
                        console.error('Error creating combinations table:', err);
                    } else {
                        console.log('Combinations table created successfully.');
                    }

                    connection.query(createResponsesTable, (err, results) => {
                        if (err) {
                            console.error('Error creating responses table:', err);
                        } else {
                            console.log('Responses table created successfully.');
                        }

                        // Close the connection after all queries are done
                        connection.end((err) => {
                            if (err) {
                                console.error('Error closing the connection:', err);
                            } else {
                                console.log('Connection closed.');
                            }
                        });
                    });
                });
            });
        });
    });
});
