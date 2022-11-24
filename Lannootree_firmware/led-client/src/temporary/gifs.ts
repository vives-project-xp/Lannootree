import fs from 'fs'

export default () => {
  
  const Gifs: Object[] = [];

  const files = fs.readdirSync('./processed/');

  files.forEach(file => {
    let raw: any = fs.readFileSync('./processed/' + file);
    Gifs.push(JSON.parse(raw))
  });

  return { Gifs, files };
}

