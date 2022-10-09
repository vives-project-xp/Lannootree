// import https from http;
import * as https from 'https';
import * as fs from 'fs';

export default class Certificate {
    
    constructor() {}

    static download(){
        const file = fs.createWriteStream("ca.crt");
        const request = https.get("https://lannootree.devbitapp.be/ca.crt", function(response) {
        response.pipe(file);
            // after download completed close filestream
            file.on("finish", () => {
                file.close();
            });
        });
    }

}
