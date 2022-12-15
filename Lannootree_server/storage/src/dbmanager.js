import fs from "fs";
import mysql from "mysql2/promise";

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

  async DBquery(query) {
    const conn = await mysql.createConnection(this.DBoptions);
    const [rows, fields] = await conn.execute(query);
    await conn.end();
    return [rows, fields];
  }

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