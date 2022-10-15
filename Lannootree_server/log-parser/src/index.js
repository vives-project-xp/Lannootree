import * as sqlite3 from 'sqlite3';
const db = new sqlite3.default.Database(':memory:');
const numberOfLogsToKeep = 2


db.serialize(() => {
    db.run("CREATE TABLE logs (id integer primary key autoincrement, container TEXT, timestamp TEXT, message TEXT)");



    addLog("testcontainer", "today", "logmessage");
    addLog("testcontainer", "today", "logmessage");
    addLog("testcontainer", "today", "logmessage");
    addLog("testcontainer", "today", "logmessage");

    addLog("container 2", "today", "logmessage");
    addLog("container 2", "today", "logmessage");
    addLog("container 2", "today", "logmessage");

    addLog("container 3", "today", "logmessage");
    addLog("container 3", "today", "logmessage");
    addLog("container 3", "today", "logmessage");
    
    


    db.each("SELECT * FROM logs", (err, row) => {
        console.log(row);
    });


    function addLog(container, timestamp, message){
        db.run(`INSERT INTO logs (container, timestamp, message) VALUES(?, ?, ?)`, [`"${container}"`,`"${timestamp}"`,`"${message}"`], (err) => {
            if(err) {
                return console.log(err.message); 
            }
        })

        db.run(`DELETE FROM logs
        where container = ? AND
        id not in (
            select id
            from logs
            WHERE container = ?
            order by id DESC
            limit ?
        )`, [`"${container}"`, `"${container}"`, numberOfLogsToKeep]);
    }
});

db.close();
