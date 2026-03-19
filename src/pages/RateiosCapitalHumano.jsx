import { useState } from 'react';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function RateiosCapitalHumano() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [rateioData, setRateioData] = useState([]);
  const [error, setError] = useState('');

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Selecione um arquivo');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Fazer upload do arquivo
      const fileData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsArrayBuffer(selectedFile);
      });

      const uploadResult = await base44.integrations.Core.UploadFile({
        file: new Blob([fileData], { type: selectedFile.type })
      });

      // Extrair dados da planilha
      const schema = {
        type: 'object',
        properties: {
          colaborador: { type: 'string' },
          folha: { type: 'number' },
          impostos: { type: 'number' },
          despesas: { type: 'number' },
          mes: { type: 'string' }
        }
      };

      const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url: uploadResult.file_url,
        json_schema: schema
      });

      if (extractResult.status === 'success') {
        setUploadedData(uploadResult.file_url);
        setRateioData(extractResult.output || []);
        setActiveTab('rateio');
      } else {
        setError(extractResult.details || 'Erro ao extrair dados do arquivo');
      }
    } catch (err) {
      setError(err.message || 'Erro ao processar arquivo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Template simples em CSV
    const csvContent = `colaborador,folha,impostos,despesas,mes
João Silva,5000,800,200,03/2026
Maria Santos,4500,720,150,03/2026
Pedro Oliveira,6000,960,300,03/2026`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_rateio_ch.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadRateio = () => {
    if (rateioData.length === 0) {
      setError('Nenhum dado para fazer download');
      return;
    }

    let csvContent = 'Colaborador,Folha,Impostos,Despesas,Mês,Total\n';
    rateioData.forEach(row => {
      const total = (row.folha || 0) + (row.impostos || 0) + (row.despesas || 0);
      csvContent += `${row.colaborador},${row.folha},${row.impostos},${row.despesas},${row.mes},${total}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rateio_ch_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Rateios de Capital Humano</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Realize rateios de folha de pagamento, impostos e despesas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-[var(--apsis-orange)] text-[var(--apsis-orange)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Upload de Planilha
        </button>
        <button
          onClick={() => setActiveTab('rateio')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'rateio'
              ? 'border-[var(--apsis-orange)] text-[var(--apsis-orange)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
          disabled={rateioData.length === 0}
        >
          Rateio Manual
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          <div className="bg-white border border-[var(--border)] rounded-lg p-8">
            <div className="space-y-4">
              {/* Download Template Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Enviar Planilha</h2>
                <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2">
                  <Download size={14} />
                  Download Template
                </Button>
              </div>

              {/* Drop zone */}
              <label className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 cursor-pointer hover:border-[var(--apsis-orange)] hover:bg-[var(--apsis-orange)]/5 transition-colors">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <Upload size={32} className="text-[var(--text-secondary)]" />
                  <div className="text-center">
                    <p className="font-medium text-[var(--text-primary)]">
                      {selectedFile?.name || 'Clique ou arraste um arquivo'}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      CSV ou Excel (folha, impostos, despesas)
                    </p>
                  </div>
                </div>
              </label>

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
                className="w-full gap-2"
              >
                <Upload size={16} />
                {isLoading ? 'Processando...' : 'Processar Arquivo'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rateio Tab */}
      {activeTab === 'rateio' && rateioData.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Dados Carregados ({rateioData.length} registros)
            </h2>
            <Button onClick={handleDownloadRateio} variant="outline" size="sm" className="gap-2">
              <Download size={14} />
              Download Rateio
            </Button>
          </div>

          {/* Tabela de dados */}
          <div className="bg-white border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">Colaborador</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-primary)]">Folha</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-primary)]">Impostos</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-primary)]">Despesas</th>
                    <th className="px-4 py-3 text-right font-semibold text-[var(--text-primary)]">Total</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">Mês</th>
                  </tr>
                </thead>
                <tbody>
                  {rateioData.map((row, idx) => {
                    const total = (row.folha || 0) + (row.impostos || 0) + (row.despesas || 0);
                    return (
                      <tr key={idx} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                        <td className="px-4 py-3 text-[var(--text-primary)]">{row.colaborador}</td>
                        <td className="px-4 py-3 text-right text-[var(--text-primary)]">
                          R$ {Number(row.folha || 0).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-4 py-3 text-right text-[var(--text-primary)]">
                          R$ {Number(row.impostos || 0).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-4 py-3 text-right text-[var(--text-primary)]">
                          R$ {Number(row.despesas || 0).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[var(--apsis-orange)]">
                          R$ {Number(total).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-4 py-3 text-[var(--text-secondary)]">{row.mes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Folha', value: rateioData.reduce((sum, r) => sum + (r.folha || 0), 0) },
              { label: 'Total Impostos', value: rateioData.reduce((sum, r) => sum + (r.impostos || 0), 0) },
              { label: 'Total Despesas', value: rateioData.reduce((sum, r) => sum + (r.despesas || 0), 0) },
              { label: 'Total Geral', value: rateioData.reduce((sum, r) => sum + ((r.folha || 0) + (r.impostos || 0) + (r.despesas || 0)), 0) },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-[var(--border)] rounded-lg p-4">
                <p className="text-xs text-[var(--text-secondary)] mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-[var(--apsis-orange)]">
                  R$ {Number(stat.value).toFixed(2).replace('.', ',')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}