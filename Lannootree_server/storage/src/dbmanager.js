import fs from "fs";
import mysql from "mysql2/promise";

// this class manages the interface with the mysql database to keep the storage.js file nice and clean.
// Every function uses async/await to make sure no function returns null because the DB query can be slow.
export default class DBManager {

  DBoptions;

  constructor(host, user, password, database) {
    this.DBoptions = {
      host     : host,
      user     : user,
      password : password,
      database : database
    };
    this.migrate(); // Make sure that the media table exists on startup
  }

  async DBquery(query) {  // This general function will be called each time a DB query needs to be executed
    const conn = await mysql.createConnection(this.DBoptions);  // wait for the connection to establish
    const [rows, fields] = await conn.execute(query);           // wait for the query to be executed, store the rows and fields
    await conn.end();                                           // end the connection
    return [rows, fields];                                      // return the rows and fields
  }

  // This function creates the media table if it not exists yet (called on startup)
  async migrate() {
    const query = `
      CREATE TABLE IF NOT EXISTS media (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        config_hash TEXT NOT NULL,
        deleted TIMESTAMP NULL
      );
    `;
    await this.DBquery(query);
  }

  // This function is called when the storage wants to add a new file to the FS and DB, here its getting added to the DB with all the necessary parameters:
  async addFile(name, category, description, config_hash) {
    const insertQuery = `INSERT INTO media (name,category,description,config_hash) VALUES ('${name}','${category}','${description}','${config_hash}')`;
    await this.DBquery(insertQuery);
    const selectQuery = `SELECT id FROM media WHERE name = '${name}' AND category = '${category}' AND description = '${description}' AND config_hash = '${config_hash}'`;
    const [rows, fields] = await this.DBquery(selectQuery);
    if(rows.length > 0) {
      return rows[0].id;
    }
    else return null;
  }

  // This function returns all the available media (in an array with objects) in the DB (WHERE deleted IS NULL). If deleted is a timestamp, it's not available anymore.
  async getAllMedia() {
    const new_media = [];
    const [rows, fields] = await this.DBquery('SELECT * FROM media WHERE deleted IS NULL');
    console.log(`GETMEDIA: there are currently ${rows.length} files in the database\n`);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      new_media.push({
        id: row.id,
        name: `${row.id}. ${row.name}`,
        category: row.category,
        description: row.description
      });
    }
    return new_media;
  }

  // This function returns the row (with all the data) for a specific media_id if deleted IS NULL. If none is found, null is returned.
  async getMediaRow(id) {
    const [rows, fields] = await this.DBquery(`SELECT * FROM media WHERE id = ${id} AND deleted IS NULL`);
    if(rows.length > 0) {
      const row = rows[0];
      if (row.deleted == null) return row;
      else return null;
    }
    else return null;
  }

}