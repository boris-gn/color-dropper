const imageLoader = (url: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
  const image = new Image();
  image.crossOrigin = '';
  
  image.onload = () => resolve(image);
  image.onerror = () => reject('error');

  image.src = url;
});

export default imageLoader;
