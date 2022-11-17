import fs from 'fs'

export default () => {
  
  const Gifs: Object[] = [];

  const files = fs.readdirSync('./src/temporary/processed/');
  
  files.forEach(file => {
    let raw: any = fs.readFileSync('./src/temporary/processed/' + file);
    Gifs.push(JSON.parse(raw))
  });

  return Gifs;
}

