/**
 * OportunidadesTab — wrapper que carrega OAPs e renderiza OportunidadesLista
 */
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import OportunidadesLista from "@/components/pipeline/OportunidadesLista";

export default function OportunidadesTab() {
  const [oaps, setOaps] = useState([]);
  const load = () => base44.entities.OAP.list("-created_date", 200).then(setOaps);
  useEffect(() => { load(); }, []);
  return <OportunidadesLista oaps={oaps} onReload={load} />;
}