import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import CameraIcon from './icons/CameraIcon';
import LoadingSpinner from './ui/LoadingSpinner';

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


const StatusCheck: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setAnalysisResult('');
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setError('Lütfen analiz için bir fotoğraf seçin.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setAnalysisResult('');

    try {
      const base64Data = await fileToBase64(imageFile);
      const image = {
        mimeType: imageFile.type,
        data: base64Data
      };
      
      const response = await analyzeImage(image, prompt || "Lütfen bu fotoğrafı analiz et.");
      setAnalysisResult(response.text);

    } catch (err) {
      console.error("Image analysis failed:", err);
      setError('Fotoğraf analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-slate-700">Durum Kontrolü (Fotoğraf Analizi)</h2>
      <div className="bg-white p-6 rounded-lg shadow-md border border-emerald-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Endişe duyduğunuz bölgenin fotoğrafını yükleyin:</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-md animate-scale-in" />
              ) : (
                <>
                  <CameraIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="text-sm text-slate-500">Dosya seçmek için tıklayın veya sürükleyip bırakın</p>
                </>
              )}
               <div className="flex text-sm text-slate-600 justify-center pt-2">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                  <span>{imagePreview ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-600">
            Sorunuz veya endişeniz (isteğe bağlı):
          </label>
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2"
            placeholder="Örn: Donör bölgemdeki bu kızarıklık normal mi?"
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading || !imageFile}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-100"
        >
          {isLoading ? <LoadingSpinner /> : 'Analiz Et'}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600 text-center animate-fade-in">{error}</p>}
      
      {analysisResult && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md opacity-0 animate-slide-in-up" style={{ animationFillMode: 'forwards' }}>
          <h3 className="text-lg font-semibold text-emerald-700 mb-2">AI Analiz Sonucu</h3>
          <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap">
            {analysisResult}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCheck;