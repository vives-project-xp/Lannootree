// place the migrations here.
// migrations are used to setup the database initially.
// so the create tables needs to be here.

import fs from "fs";
import * as sqlite3 from 'sqlite3';

const db = new sqlite3.default.Database('./db/storage.sqlite');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS media (" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "name TEXT, " +
    "category TEXT, " +
    "description TEXT, " +
    "config_hash TEXT, " +
    "filename_hash TEXT" +
    ")"
  );

  // db.run("CREATE TABLE IF NOT EXISTS settings (" +
  //   "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
  //   "setting TEXT, " +
  //   "value TEXT, " +
  //   ")"
  // );

  // db.run("CREATE TABLE IF NOT EXISTS buttonmapper (" +
  //   "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
  //   "button TEXT, " +
  //   "value TEXT, " +
  //   ")"
  // );



//populate media examples--------------------------------------------------------------------------

  fs.readdir("./db/config1", (err, files) => {
    files.forEach(file => {
      let media_obj = {
        name: `${file.replace('.json','').replace('.gif','')}`,
        category: "gif",
        description: `description_${file}`
      };
      db.run(`INSERT INTO media (name,category,description,config_hash,filename_hash) VALUES ('${media_obj.name}','${media_obj.category}','${media_obj.description}','config1','${file}')`);
    });
  });

  db.each(`SELECT * FROM media`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(`id: ${row.id}\tname: ${row.name}\tcategory: ${row.category}\tdescription: ${row.description}`);
  });

});