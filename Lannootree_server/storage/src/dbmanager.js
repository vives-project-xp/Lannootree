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

  // async updateDBfromFiles() {
  //   let newMediaAdded = 0;
  //   fs.readdir("./db/config1", (err, files) => {
  //     files.forEach(async file => {
  //       let media_obj = {
  //         name: `${file.replace('.json','').replace('.gif','')}`,
  //         category: "gif",
  //         description: `description_${file}`
  //       };
  //       const [rows, fields] = await this.DBquery(`SELECT * FROM media WHERE filename_hash = '${file}'`)
  //       if (!(rows.length > 0)) {
  //         const insertQuery = `INSERT INTO media (name,category,description,config_hash,filename_hash) VALUES ('${media_obj.name}','${media_obj.category}','${media_obj.description}','config1','${file}')`;
  //         await this.DBquery(insertQuery);
  //         newMediaAdded++;
  //       }
  //     });
  //   });
  //   console.log(`UPDATEDB: added ${newMediaAdded} new files to the database`);
  // }

  async getAllMedia() {
    //await this.updateDBfromFiles();
    const new_media = [];
    const [rows, fields] = await this.DBquery('SELECT * FROM media');
    console.log(`GETMEDIA: there are currently ${rows.length} files in the database\n`);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      new_media.push({
        id: row.id,
        name: row.name,
        category: row.category,
        description: row.description
      });
    }
    return new_media;
  }

  async getMediaRow(id) {
    const [rows, fields] = await this.DBquery(`SELECT * FROM media WHERE id = ${id}`);
    if(rows.length > 0) {
      const row = rows[0];
      if (row.deleted == null) return row;
      else return null;
    }
    else return null;
  }

}