export function getEverageImageColor(imageElement){
  var blockSize = 5, // only visit every 5 pixels
      defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
      canvas = document.createElement('canvas'),
      context = canvas.getContext && canvas.getContext('2d'),
      data, width, height,
      i = -4,
      length,
      rgb = {r:0,g:0,b:0},
      count = 0;
      
  if (!context) {
      return defaultRGB;
  }

  height = canvas.height = imageElement.naturalHeight || imageElement.offsetHeight || imageElement.height;
  width = canvas.width = imageElement.naturalWidth || imageElement.offsetWidth || imageElement.width;
  
  context.drawImage(imageElement, 0, 0);
  
  try {
      data = context.getImageData(0, 0, width, height);
  } catch(e) {
      /* security error, img on diff domain */alert('x');
      return defaultRGB;
  }
  
  length = data.data.length;
  
  while ( (i += blockSize * 4) < length ) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i+1];
      rgb.b += data.data[i+2];
  }
  
  // ~~ used to floor values
  rgb.r = ~~(rgb.r/count);
  rgb.g = ~~(rgb.g/count);
  rgb.b = ~~(rgb.b/count);
  
  return rgb;
}

export function isLight(imageElement){
  const rgb = getEverageImageColor(imageElement);
  var o = Math.round(((parseInt(rgb.r) * 299) + (parseInt(rgb.g) * 587) + (parseInt(rgb.b) * 114)) /1000);
  return o < 126;
}

export function isDark(imageElement){
  return !isLight(imageElement);
}

export function getResizeHandleColor(imageElement) {
  return isLight(imageElement) ? '#fff' : '#000'
}