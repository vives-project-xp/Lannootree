// place the migrations here.
// migrations are used to setup the database initially.
// so the create tables needs to be here.

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

  for (let i = 0; i < 21; i++) {
    let media_obj = {
      name: `gif ${i}`,
      category: "gif",
      description: `description gif ${i}`
    };
    db.run(`INSERT INTO media (name,category,description) VALUES ('${media_obj.name}','${media_obj.category}','${media_obj.description}')`);
  }

  db.each(`SELECT * FROM media`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(`id: ${row.id}\tname: ${row.name}\tcategory: ${row.category}\tdescription: ${row.description}`);
  });

});