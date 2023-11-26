import { Inter } from 'next/font/google';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { useFabricJSEditor, FabricJSCanvas } from 'fabricjs-react';
import { fabric } from 'fabric';

const inter = Inter({ subsets: ['latin'] });
const imagenes = [
  'https://cf.shopee.com.mx/file/57ca00788517873f4764d6b4ebe61c4f',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZvPxOindKfTLcmTiJE_pHgstNl970cJWZl8WHQJYHgl0dSFMEmRpXY6aCBSrjLY94HvM&usqp=CAU',
  'https://cdn1.coppel.com/images/catalog/mkp/7005/3000/70051994-1.jpg',
];
const Home = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageObjects, setImageObjects] = useState([]);
  const [filesArray, setFilesArray] = useState([]);

  const handleExportClick = () => {
    if (editor && editor.canvas) {
      const canvasData = [];
  
      for (let i = 0; i < imagenes.length; i++) {
        const canvas = new fabric.Canvas(null, { width: editor.canvas.width, height: editor.canvas.height });
  
        fabric.Image.fromURL(
          imagenes[i],
          (img) => {
            img.scaleToWidth(canvas.width);
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
  
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

            for (const objectId in imageObjects) {
              if (imageObjects.hasOwnProperty(objectId)) {
                const object = imageObjects[objectId];
                if(object.index === i){
                  canvas.add(object.img);
                  canvas.bringToFront(object.img);
                }}
            }
            // Add your canvas-specific objects here
  
            // Get canvas data
            const canvasDataItem = {
              imageData: canvas.toDataURL({ format: 'png', quality: 1 }),
              // Add other properties as needed
            };
  
            canvasData.push(canvasDataItem);
  
            // Show JSON in the console after processing all canvases
            if (i === imagenes.length - 1) {
              console.log(JSON.stringify(canvasData, null, 2));
            }
          },
          { crossOrigin: 'anonymous' }
        );
      }
    }
  };
  

  const handleInputChange = (event) => {
    const files = event.target.files;

    const idGenerated = uuidv4();
    if (files.length > 0 && editor) {
      const newFiles = Array.from(files).map((file) => ({
        id: idGenerated, // Puedes utilizar alguna función para generar un ID único
        groupIndex: currentImageIndex,
        imageUrl: URL.createObjectURL(file),
      }));

      setFilesArray((prevFilesArray) => [...prevFilesArray, ...newFiles]);

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
            id: idGenerated,
          });

          editor.canvas.add(oImg);
          editor.canvas.bringToFront(oImg);

          setImageObjects(prevImageObjects => ({
            ...prevImageObjects,
            [idGenerated]: {
              img: oImg,
              index: currentImageIndex
            }
          }))
        });
      });
    }
    console.log(imageObjects);
  };

  const handleImageClick = (index) => {
    if (editor && editor.canvas) {
      if (index === currentImageIndex) {
        // Si el índice clickeado es el mismo que el índice actual, no hagas nada
        return;
      }
  
      // Setear el nuevo currentImageIndex
      setCurrentImageIndex(index);
  
      // Filtrar los elementos de filesArray por el nuevo currentImageIndex
      const filteredFilesArray = filesArray.filter((file) => file.groupIndex === index);
  
      // Limpiar el canvas antes de agregar las nuevas imágenes
      editor.canvas.clear();
      for (const objectId in imageObjects) {
        if (imageObjects.hasOwnProperty(objectId)) {
          const object = imageObjects[objectId];
          if(object.index === index){
            editor.canvas.add(object.img);
            editor.canvas.bringToFront(object.img);
          }}
      }
      // Agregar las nuevas imágenes al canvas
    }
  };

  const handleDeleteImage = (id) => {
    const toDelete = imageObjects[id].img;
    console.log(toDelete);
    if (editor && editor.canvas) {
      if (toDelete) {
        // Remove the corresponding element from filesArray
        setFilesArray((prevFilesArray) =>
          prevFilesArray.filter((file) => file.id !== id)
        );
        setImageObjects((prevImageObjects) => {
          const updatedImageObjects = { ...prevImageObjects };
          delete updatedImageObjects[id];
          return updatedImageObjects;
        });

        editor.canvas.remove(toDelete);
      }
    }
  };

  useEffect(() => {
    if (editor && editor.canvas) {
      // Crear una imagen de fondo
      fabric.Image.fromURL(
        imagenes[currentImageIndex],
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

          // Limpiar el canvas antes de cargar la nueva imagen
          editor.canvas.clear();
          editor.canvas.setBackgroundImage(img, editor.canvas.renderAll.bind(editor.canvas));
        },
        { crossOrigin: 'anonymous' }
      );
    }
  }, []);

  useEffect(() => {
    if (editor && editor.canvas) {
      // Crear una imagen de fondo
      fabric.Image.fromURL(
        imagenes[currentImageIndex],
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

          // Limpiar el canvas antes de cargar la nueva imagen
          editor.canvas.setBackgroundImage(img, editor.canvas.renderAll.bind(editor.canvas));
        },
        { crossOrigin: 'anonymous' }
      );
    }
  }, [editor]);

  return (
    <div className={`fixed flex w-full h-full p-10 bg-black`}>
      <div className={`flex flex-col m-10 w-1/3 h-5/6 bg-gray-600 bg-cover bg-center`}>
        <FabricJSCanvas className={`flex bg-blue-300 w-full h-5/6`} onReady={onReady} />
        <div className={`flex w-full h-1/6 items-center justify-center`}>
          {
            imagenes.map((imagen, index) => (
              <div
                key={index}
                className="flex items-center justify-center cursor-pointer mr-2 bg-gray-300 rounded"
                onClick={() => handleImageClick(index)}
              >
                <img src={imagen} alt={`imagen-${index}`} className="w-16 h-16 object-cover rounded" />
              </div>
            ))}
        </div>
      </div>
      <div className={`flex flex-col m-10 w-1/2 h-5/6 bg-black`}>
        <div className={`flex bg-blue-300 mb-20 w-full h-1/4`}>
          {filesArray.map((inputFile, index) => (
            inputFile.groupIndex == currentImageIndex &&
            <div key={index} className={`relative w-full h-full mb-2`}>
              {console.log(inputFile.id)}
              <img src={inputFile.imageUrl} alt={`user-image-${index}`} className={`w-full h-full object-cover`} />
              <button
                className={`absolute top-0 right-0 bg-red-500 text-white p-1`}
                onClick={() => {handleDeleteImage(inputFile.id)}}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div className={`flex bg-blue-300 mb-20 w-full h-1/4`}>
        </div>
        <div className={`flex-col bg-blue-300 w-full h-1/4`}>
          <input type="file" accept="image/*" className={`flex bg-blue-300 w-full h-1/4`} onChange={handleInputChange} />
          <button className={`bg-blue-500 text-white p-2`} onClick={handleExportClick}>
            Exportar Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
