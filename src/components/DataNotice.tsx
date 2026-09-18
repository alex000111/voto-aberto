export default function DataNotice({state}:{state:'unconfigured'|'error'|'empty'}){
 const messages={unconfigured:'A base de dados ainda não está conectada. Os registros serão exibidos após a primeira importação oficial.',error:'Não foi possível consultar os dados agora. Isso não significa que não existam registros. Tente novamente mais tarde.',empty:'Nenhum registro disponível nesta consulta. Isso não comprova ausência na fonte oficial.'};
 return <div className="note" role="status">{messages[state]}</div>;
}
