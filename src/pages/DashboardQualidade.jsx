import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, TrendingUp, Activity } from "lucide-react";

export default function DashboardQualidade() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevisoes: 0,
    aprovadas: 0,
    reprovadas: 0,
    pendentes: 0
  });

  useEffect(() => {
    // Placeholder - substitua com dados reais quando houver entidade de revisões
    setStats({
      totalRevisoes: 24,
      aprovadas: 18,
      reprovadas: 2,
      pendentes: 4
    });
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-12">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#DDE3DE]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Revisões</CardTitle>
            <Activity className="h-4 w-4 text-[#F47920]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1A2B1F]">{stats.totalRevisoes}</div>
            <p className="text-xs text-[#5C7060]">Este período</p>
          </CardContent>
        </Card>

        <Card className="border-[#DDE3DE]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1A2B1F]">{stats.aprovadas}</div>
            <p className="text-xs text-[#5C7060]">{((stats.aprovadas / stats.totalRevisoes) * 100).toFixed(0)}% de aprovação</p>
          </CardContent>
        </Card>

        <Card className="border-[#DDE3DE]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reprovadas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1A2B1F]">{stats.reprovadas}</div>
            <p className="text-xs text-[#5C7060]">Requer ação</p>
          </CardContent>
        </Card>

        <Card className="border-[#DDE3DE]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1A2B1F]">{stats.pendentes}</div>
            <p className="text-xs text-[#5C7060]">Aguardando revisão</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#DDE3DE]">
        <CardHeader>
          <CardTitle className="text-[#1A2B1F]">Resumo de Qualidade</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#5C7060] text-sm">Painel de Qualidade e Revisões — em desenvolvimento</p>
        </CardContent>
      </Card>
    </div>
  );
}