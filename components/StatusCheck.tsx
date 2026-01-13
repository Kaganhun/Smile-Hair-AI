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
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Durum Kontrolü (Fotoğraf Analizi)</h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Endişe duyduğunuz bölgenin fotoğrafını yükleyin:</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-blue-400 transition-colors bg-slate-50">
            <div className="space-y-2 text-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mx-auto h-48 w-auto rounded-lg shadow-md animate-scale-in" />
              ) : (
                <>
                  <div className="mx-auto h-14 w-14 text-slate-300 bg-white rounded-full flex items-center justify-center shadow-sm">
                     <CameraIcon className="h-8 w-8" />
                  </div>
                  <p className="text-sm text-slate-500">Fotoğraf çekin veya yükleyin</p>
                </>
              )}
               <div className="flex text-sm text-slate-600 justify-center pt-2">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-bold text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>{imagePreview ? 'Fotoğrafı Değiştir' : 'Dosya Seç'}</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-semibold text-slate-700">
            Sorunuz veya endişeniz (isteğe bağlı):
          </label>
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-slate-50"
            placeholder="Örn: Donör bölgemdeki bu kızarıklık normal mi?"
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading || !imageFile}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-98"
        >
          {isLoading ? <LoadingSpinner /> : 'Analiz Et'}
        </button>
      </div>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-fade-in">{error}</div>}
      
      {analysisResult && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg opacity-0 animate-slide-in-up border-l-4 border-blue-500" style={{ animationFillMode: 'forwards' }}>
          <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
             <span className="text-xl">🩺</span> AI Analiz Sonucu
          </h3>
          <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">
            {analysisResult}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCheck;