import { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function UploadMaterialPlanilha({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errors, setErrors] = useState([]);

  const downloadTemplate = () => {
    const template = `Nome,Categoria,Código,Marca,Modelo,Quantidade,Valor Unitário,Fornecedor,Processador,RAM (GB),Armazenamento (GB),SO,Tempo Uso (meses),Número Série,Descrição
Notebook Dell,notebooks,NB-001,Dell,Inspiron 15,5,3500,Dell,Intel i5,8,256,windows,6,ABC123,Notebook para desenvolvimento`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_materiais.csv';
    a.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(file);
      setErrors([]);
      setUploadStatus(null);
    }
  };

  const processFile = async () => {
    if (!fileSelected) {
      toast.error('Selecione um arquivo');
      return;
    }

    setLoading(true);
    try {
      const fileUrl = await base44.integrations.Core.UploadFile({ file: fileSelected });
      
      const schema = {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          categoria: { type: 'string' },
          codigo: { type: 'string' },
          marca: { type: 'string' },
          modelo: { type: 'string' },
          quantidade_atual: { type: 'number' },
          valor_unitario: { type: 'number' },
          fornecedor: { type: 'string' },
          processador: { type: 'string' },
          ram_gb: { type: 'number' },
          armazenamento_gb: { type: 'number' },
          sistema_operacional: { type: 'string' },
          tempo_uso_meses: { type: 'number' },
          numero_serie: { type: 'string' },
          descricao: { type: 'string' }
        }
      };

      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: fileUrl.file_url,
        json_schema: schema
      });

      if (result.status === 'error') {
        setErrors([result.details]);
        setUploadStatus('error');
        return;
      }

      const materials = Array.isArray(result.output) ? result.output : [result.output];
      const validMaterials = materials.filter(m => m.nome && m.categoria);

      if (validMaterials.length === 0) {
        setErrors(['Nenhum material válido encontrado na planilha']);
        setUploadStatus('error');
        return;
      }

      await base44.entities.Material.bulkCreate(validMaterials);
      
      setUploadStatus('success');
      setFileSelected(null);
      toast.success(`${validMaterials.length} material(is) importado(s)`);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrors([err.message || 'Erro ao processar arquivo']);
      setUploadStatus('error');
      toast.error('Erro ao importar materiais');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Template Download */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 mb-2">
          Baixe o template para preencher com seus dados:
        </p>
        <button
          onClick={downloadTemplate}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
        >
          ⬇️ Baixar template CSV
        </button>
      </div>

      {/* File Upload Area */}
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
          disabled={loading}
        />
        <label htmlFor="file-input" className="cursor-pointer block">
          <Upload size={32} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-medium text-slate-900 mb-1">
            {fileSelected ? fileSelected.name : 'Clique para selecionar ou arraste um arquivo'}
          </p>
          <p className="text-xs text-slate-500">Formatos: CSV ou XLSX</p>
        </label>
      </div>

      {/* Upload Button */}
      {fileSelected && (
        <button
          onClick={processFile}
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {loading ? 'Processando...' : 'Importar Materiais'}
        </button>
      )}

      {/* Status Messages */}
      {uploadStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">Materiais importados com sucesso!</p>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
          {errors.map((err, i) => (
            <div key={i} className="flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-900">{err}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}