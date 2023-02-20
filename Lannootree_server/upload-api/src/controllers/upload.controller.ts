import util from 'util'

export const index = (req: any, res: any) => {
  res.send('OK');
}

export const uploadMultiple = (req: any, res: any) => {
  console.log(req.files);
  console.log(req.body);

  console.log(``),

  return res.redirect('/');
}

