import WebFont from 'webfontloader';

export const loadFont = (fontName) => {
  return new Promise((resolve, reject) => {
    if (!document.fonts.check(`1em ${fontName}`)) {
      WebFont.load({
        google: {
          families: [fontName]
        },
        active: () => {
          resolve();
        },
        inactive: () => {
          reject();
        }
      });
    } else {
      resolve();
    }
  });
};
