const fs = require('fs');

const readPro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, dataa) => {
      if (err) reject('erorr');
      resolve(dataa);
    });
  });
};

const writePro = (file, string) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, string, (err) => {
      if (err) reject(err);
      resolve('done');
    });
  });
};

const getDes = async () => {
  try {
    const data = await readPro('tesst.txt'); // wait 1 promises
    console.log(data.toString());

    await writePro('testwrite.txt', data);
  } catch {
    console.log('error');
    throw 'error roi';
  }
  return 'Done!!';
};

(async () => {
  try {
    const x = await getDes();
    console.log(x);
  } catch (errr) {
    console.log(errr);
  }
})();

// getDes()
// .then(res =>{
//     console.log(res);
// })
// .catch(rej =>{
//     console.log(rej);
// })
