import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function DocumentosHeader() {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <>
      {showInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <HelpCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Data Room Segura</h3>
              <p className="text-sm text-blue-800 mb-3">
                Seus documentos são armazenados de forma segura. O APSIS controla quem pode visualizar cada arquivo.
              </p>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 underline">
                Como funciona?
              </button>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="text-blue-400 hover:text-blue-600 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}