import Compressor from "compressorjs";

// 图片压缩器
export default function (upload_file,quality=0.6) {
  return new Promise((reslove, reject) => {
    new Compressor(upload_file, {
      quality,
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
