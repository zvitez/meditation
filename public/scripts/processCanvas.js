onmessage = function(e) {
  let pixels = e.data[0],
    width = e.data[1],
    height = e.data[2],
    dots = [],        
    x = 0,
    y = 0,
    fx = width,
    fy = height,
    w = 0,
    h = 0;

  for (var p = 0; p < pixels.length; p += 4) {
    if (pixels[p] > 0) {        
      dots.push({
        x: x,
        y: y
      });
      
      w = x > w ? x : w;
      h = y > h ? y : h;
      fx = x < fx ? x : fx;
      fy = y < fy ? y : fy;
    }
    
    x += 1;              

    if (x >= width) {
      x = 0;
      y += 1;        
    }
  } 

  postMessage({ dots: dots, w: w + fx, h: h + fy });
}