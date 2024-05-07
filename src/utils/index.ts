const componentToHex = (c: number): string => {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};


export const getUrlParams = (link: string) => {
  console.log('1------------------------')
  const links = window.location.search.substring(1).split('=');
  const index = links.findIndex(item => item === link) + 1;

  return links[index];
};