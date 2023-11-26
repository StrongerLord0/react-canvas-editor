import React from 'react';
import { useEffect, useState } from 'react';
import { useFabricJSEditor, FabricJSCanvas } from 'fabricjs-react';
import { fabric } from 'fabric';


export default function ImageEditor({ imagen }) {
  
  const { editor, onReady } = useFabricJSEditor();

  useEffect(() => {
    if (editor && editor.canvas) {
      // Crear una imagen de fondo
      fabric.Image.fromURL(
        imagen,
        (img) => {
          img.scaleToWidth(editor?.canvas.width);
          img.set({
            originX: 'left',
            originY: 'top',
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            zIndex: 1,
          });
          editor.canvas.setBackgroundImage(img, editor.canvas.renderAll.bind(editor.canvas));
        },
        { crossOrigin: 'anonymous' } // Añade esto si la imagen está en un dominio diferente
      );
    }
  }, [editor]);


  return (
    <FabricJSCanvas className={`flex bg-blue-300 w-full h-5/6`} onReady={onReady} />
  );
}
