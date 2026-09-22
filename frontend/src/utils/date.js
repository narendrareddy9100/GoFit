export const fmt=d=>new Date(d).toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'});
export const today=()=>new Date().toISOString().slice(0,10);
