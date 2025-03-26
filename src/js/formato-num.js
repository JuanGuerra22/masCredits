
export function formatearValor(valor){
    if(typeof valor !== "number"){
        return valor;
    }
    return valor.toLocaleString('es-CO', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}