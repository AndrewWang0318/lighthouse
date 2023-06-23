import Compressor from "compressorjs";
export default function (upload_file) {
  return new Promise((reslove, reject) => {
    new Compressor(upload_file, {
      quality: 0.6,
      success(result) {
        const file = new window.File([result], upload_file.name, {
          type: upload_file.type,
        });
        reslove(file);
      },
      error(err) {
        reject(err);
      },
    });
  });
}
