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

export const loadLocalFont = (fontName, fontPath, fontFamily) => {
  if (document.fonts.check(`1em ${fontName}`)) {
      return;
  }

  const font = new FontFace(fontName, 'url(' + fontPath + ')');
  
  font.load().then(function(loadedFont) {
    document.fonts.add(loadedFont);
    document.body.style.fontFamily = `${fontName}, ${fontFamily}`;
  }).catch(function(error) {
    console.error('Failed to load font:', error);
  });
};
