import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useFabricJSEditor, FabricJSCanvas } from 'fabricjs-react';
import { fabric } from 'fabric';
import ImageEditor from './ImageEditor';

const inter = Inter({ subsets: ['latin'] });

const imagenes = [
  'https://cf.shopee.com.mx/file/57ca00788517873f4764d6b4ebe61c4f',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZvPxOindKfTLcmTiJE_pHgstNl970cJWZl8WHQJYHgl0dSFMEmRpXY6aCBSrjLY94HvM&usqp=CAU',
  'https://cdn1.coppel.com/images/catalog/mkp/7005/3000/70051994-1.jpg',
]

const Home = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [inputFiles, setInputFiles] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [canvases, setCanvases] = useState([]);

  const handleInputChange = (event) => {
    const files = event.target.files;
  
    if (files.length > 0 && editor) {
      const newFiles = Array.from(files).map((file) => ({
        file,
        imageUrl: URL.createObjectURL(file),
      }));
  
      setInputFiles((prevFiles) => [...prevFiles, ...newFiles]); // Append new files to the existing ones
  
      newFiles.forEach(({ imageUrl }) => {
        fabric.Image.fromURL(imageUrl, function (oImg) {
          oImg.scaleToWidth(editor?.canvas.width / 3);
          const offsetX = editor?.canvas.width / 2;
          const offsetY = editor?.canvas.height / 2;
          oImg.set({
            left: offsetX,
            top: offsetY,
            originX: 'center',
            originY: 'center',
            zIndex: 100,
          });
          editor.canvas.add(oImg);
          editor.canvas.bringToFront(oImg);
        });
      });
    }
  };

  const handleExportClick = () => {
    if (editor && editor.canvas) {
      const dataUrl = editor.canvas.toDataURL({
        format: 'png',
        quality: 1,
      });

      // Crear un enlace temporal y hacer clic en él para descargar la imagen
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'canvas-export.png';
      link.click();
    }
  };



  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
  };
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagenes.length) % imagenes.length);
  };

  const handleDeleteClick = (index) => {
    if (editor && editor.canvas) {
      const removedImage = editor.canvas.item(index);
      if (removedImage) {
        editor.canvas.remove(removedImage);
        setInputFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      }
    }
  };

  return (
    <div className={`fixed flex w-full h-full p-10 bg-black`}>
      <div className={`flex flex-col m-10 w-1/3 h-5/6 bg-gray-600 bg-cover bg-center`}>
        <ImageEditor imagen= {imagenes[index]}/>
        <div className={`flex w-full h-1/6`}>
          {/* Añade controles para cambiar entre imágenes */}
          <button className="text-white" onClick={handlePrevImage}>
            Anterior
          </button>
          <span className="text-white mx-2">{currentImageIndex + 1}/{imagenes.length}</span>
          <button className="text-white" onClick={handleNextImage}>
            Siguiente
          </button>
        </div>
      </div>
      <div className={`flex flex-col m-10 w-1/2 h-5/6 bg-black`}>
        <div className={`flex bg-blue-300 mb-20 w-full h-1/4`}>
          {inputFiles.map((inputFile, index) => (
            <div key={index} className={`relative w-full h-full mb-2`}>
              <img src={inputFile.imageUrl} alt={`user-image-${index}`} className={`w-full h-full object-cover`} />
              <button
                className={`absolute top-0 right-0 bg-red-500 text-white p-1`}
                onClick={() => handleDeleteClick(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div className={`flex bg-blue-300 mb-20 w-full h-1/4`}>
          a
        </div>
        <div className={`flex-col bg-blue-300 w-full h-1/4`}>
          <input type="file" accept="image/*" className={`flex bg-blue-300 w-full h-1/4`} onChange={handleInputChange} multiple />
          <button className={`bg-blue-500 text-white p-2`} onClick={handleExportClick}>
            Exportar Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
