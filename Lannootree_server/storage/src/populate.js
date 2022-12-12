import fs from "fs";
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
  fs.readdir("./db/config1", (err, files) => {
    files.forEach(file => {
      let media_obj = {
        name: `${file.replace('.json','').replace('.gif','')}`,
        category: "gif",
        description: `description_${file}`
      };
      DBconnection.query(`INSERT INTO media (name,category,description,config_hash,filename_hash) VALUES ('${media_obj.name}','${media_obj.category}','${media_obj.description}','config1','${file}')`, (error, results) => {
        if (error) {
          throw error;
        }
      });
    });
  });
});