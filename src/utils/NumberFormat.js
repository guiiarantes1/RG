const formatarNumero = (valor) => {
    const numero = typeof valor === 'string'
        ? parseFloat(valor.replace(/\./g, '').replace(',', '.'))
        : valor;

    if (isNaN(numero)) {
        throw new Error("O valor deve ser um número ou uma string numérica válida.");
    }

    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export { formatarNumero };
