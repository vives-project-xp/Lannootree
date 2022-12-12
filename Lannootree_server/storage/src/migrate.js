// place the migrations here.
// migrations are used to setup the database initially.
// so the create tables needs to be here.

import mysql from "mysql";

const DBconnection = mysql.createConnection({
  host     : 'localhost',
  user     : 'storage',
  password : 'storage',
  database : 'storage'
});

DBconnection.connect(error => {
  if (error) {
    throw error;
  }
  console.log('Successfully connected to the database');
  const sql = "CREATE TABLE IF NOT EXISTS media (id INTEGER PRIMARY KEY AUTO_INCREMENT, name TEXT, category TEXT, description TEXT, config_hash TEXT, filename_hash TEXT)";
  DBconnection.query(sql, error => {
    if (error) {
      throw error;
    }
    console.log('Successfully created table "media"');
  });
});