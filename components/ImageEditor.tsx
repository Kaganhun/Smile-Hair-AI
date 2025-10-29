import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import CameraIcon from './icons/CameraIcon';
import LoadingSpinner from './ui/LoadingSpinner';
import WandIcon from './icons/WandIcon';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};


const ImageEditor: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setEditedImage(null);
      setError('');
      const previewUrl = URL.createObjectURL(file);
      setOriginalImage(previewUrl);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile || !prompt.trim()) {
      setError('Lütfen bir fotoğraf seçin ve bir düzenleme komutu girin.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setEditedImage(null);

    try {
      const base64Data = await fileToBase64(imageFile);
      const image = {
        mimeType: imageFile.type,
        data: base64Data
      };
      
      const resultBase64 = await editImage(image, prompt);
      if (resultBase64) {
        setEditedImage(`data:image/png;base64,${resultBase64}`);
      } else {
        setError('Görsel düzenlenemedi. Lütfen farklı bir komutla tekrar deneyin.');
      }

    } catch (err) {
      console.error("Image editing failed:", err);
      setError('Görsel düzenlenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-slate-700">Görsel Editör (AI Destekli)</h2>
      <div className="bg-white p-6 rounded-lg shadow-md border border-emerald-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">1. Fotoğraf Yükle</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {originalImage ? (
                  <img src={originalImage} alt="Original" className="mx-auto h-32 w-auto rounded-md object-contain animate-scale-in" />
                ) : (
                  <>
                    <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="text-sm text-slate-500">Bir dosya seçin</p>
                  </>
                )}
                 <div className="flex text-sm text-slate-600 justify-center pt-2">
                  <label htmlFor="image-editor-file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500">
                    <span>{originalImage ? 'Değiştir' : 'Gözat'}</span>
                    <input id="image-editor-file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-600">
              2. Düzenleme Komutu Girin
            </label>
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2"
              placeholder="Örn: Retro bir filtre ekle, saçları kırmızı yap, arka planı bulanıklaştır..."
            />
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading || !imageFile || !prompt.trim()}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-100"
        >
          {isLoading ? <LoadingSpinner /> : <><WandIcon className="w-5 h-5 mr-2" /> Düzenle</>}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600 text-center animate-fade-in">{error}</p>}
      
      {(isLoading || editedImage) && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <div className="text-center">
            <h3 className="font-semibold text-slate-600 mb-2">Orijinal</h3>
            {originalImage && <img src={originalImage} alt="Original" className="rounded-lg shadow-md w-full" />}
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-slate-600 mb-2">Düzenlenmiş</h3>
            <div className="w-full aspect-square bg-slate-100 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
              {isLoading && <LoadingSpinner />}
              {editedImage && <img src={editedImage} alt="Edited" className="rounded-lg w-full h-full object-contain animate-scale-in" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;