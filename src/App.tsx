import React, { useCallback, useEffect, useRef, useState } from 'react';

import imageLoader from './components/loadingImage';
import Loader from './components/loader';

import { rgbToHex, getUrlParams } from './utils';
import { rectPositionCoefficient } from './constants';

import pickerIcon from './images/IconColorPicker.svg';
import './App.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDropperActive, setIsDropperActive] = useState(false);
  const [pickedColor, setPickedColor] = useState('');

  const currentColor = useRef('');

  const [loading, setLoading] = useState(true);

  const handleDropperClick = () => {
    setIsDropperActive((prevState) => !prevState);
  };

  const drawScaledImage = (img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas ;
    const hRatio = canvas.width  / img.width;
    const vRatio =  canvas.height / img.height;
    const ratio  = Math.min ( hRatio, vRatio );
    const centerShift_x = ( canvas.width - img.width * ratio ) / 2;
    const centerShift_y = ( canvas.height - img.height * ratio ) / 2;  
    
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio,
    );  
  }

  const loadedImage = useRef<HTMLImageElement>();
 
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d'); 
    const imageUrl = getUrlParams('image');

    if (ctx) { 
      (async () => {
        const img = await imageLoader(imageUrl);
        loadedImage.current = img;
        drawScaledImage(img, ctx);

        setLoading(false);
      })();
    }
  }, []);

  const drawTextInShape = (ctx: CanvasRenderingContext2D, hexColor: string, x: number, y: number) => {
    ctx.fillStyle = '#fff';
    ctx.font = "bold 13px Arial";
    ctx.fillText(hexColor, x - rectPositionCoefficient / 2 - 5, y + rectPositionCoefficient / 2);
  }

  const drawCircle = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    const pixelData = ctx.getImageData(mouseX, mouseY, 1, 1).data;
    const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
    
    currentColor.current = hexColor;
    
    ctx.beginPath();
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = 5;

    loadedImage.current && drawScaledImage(loadedImage.current, ctx);
    
    // Draw the image inside the circle
    ctx.save();
    ctx.arc(mouseX, mouseY, rectPositionCoefficient, 0, 2 * Math.PI);
    ctx.clip();

    if (!canvasRef.current) return;

    const startX = mouseX - rectPositionCoefficient;
    const startY = mouseY - rectPositionCoefficient;
    const endX = mouseX + rectPositionCoefficient;
    const endY = mouseY + rectPositionCoefficient;
    const scaleX = 2;
    const scaleY = 2;

    ctx.drawImage(
      canvasRef.current,
      startX,
      startY,
      endX - startX,
      endY - startY,
      startX,
      startY,
      (endX - startX) * scaleX,
      (endY - startY) * scaleY,
    );

    drawTextInShape(ctx, hexColor, mouseX, mouseY);

    ctx.restore();
    ctx.stroke();
  }, []);

  const handleMousedown = () => {
    if (!isDropperActive) return;
    setPickedColor(currentColor.current);
  };

  if (!getUrlParams('image')) {
    return <div>
      <span>Should load image from url</span>
      <br/>
      <span>For exsample: <i>image=https://i.redd.it/8lsr0f50jdpy.png</i></span>
    </div>;
  }

 
  return (
    <div className="App">
      <div className='controll-box'>
        <img onClick={handleDropperClick} className={`picker ${isDropperActive ? 'drop-active' : '' }`} alt='' src={pickerIcon} />
        <h1>Picked Color: {pickedColor}</h1>
      </div>
      
      {loading ? <Loader /> : null}
      
      <canvas
        className='canvas'
        ref={canvasRef}
        width="1024"
        height="1024"
        onMouseMove={drawCircle}
        onMouseDown={handleMousedown}
      />
    </div>
  );
}

export default App;
