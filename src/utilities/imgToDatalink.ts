const fileToDataLink = (file: Blob): Promise<string> => new Promise((resolve, reject): void => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    if (reader.result) {
      resolve(reader.result.toString());
    } else {
      reject(new Error('reject'));
    }
  };
  reader.onerror = (error) => reject(error);
});

function loadImg(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => reject();
  });
}

function formatImg(img: HTMLImageElement, size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (img.width > img.height) {
      const diff = img.width - img.height;
      ctx.drawImage(img, diff / 2, 0, img.height, img.height, 0, 0, canvas.width, canvas.height);
    } else {
      const diff = img.height - img.width;
      ctx.drawImage(img, 0, diff / 2, img.width, img.width, 0, 0, canvas.width, canvas.height);
    }
  } else {
    throw new Error('Canvas cannot get context');
  }

  return canvas;
}

export default async function getFormattedImgDataLink(size: number, file: File): Promise<string> {
  const url: string = await fileToDataLink(file);
  const img = await loadImg(url);
  const canvas = formatImg(img, size);
  return canvas.toDataURL();
}
