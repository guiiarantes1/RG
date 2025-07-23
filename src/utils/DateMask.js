export const applyDateMask = (value) => {
  let maskedValue = value.replace(/\D/g, '');

  if (maskedValue.length <= 2) {
    maskedValue = maskedValue.replace(/(\d{2})/, '$1');
  } else if (maskedValue.length <= 4) {
    maskedValue = maskedValue.replace(/(\d{2})(\d{2})/, '$1/$2');
  } else if (maskedValue.length <= 6) {
    maskedValue = maskedValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  } else {
    maskedValue = maskedValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  }

  return maskedValue;
};

export default applyDateMask;  

export const maskDateDDMMYYYY = (data) => {
    if (!data) return null;

    const dateObj = data instanceof Date ? data : new Date(data);
    if (isNaN(dateObj)) return null;

    const dia = String(dateObj.getDate()).padStart(2, '0');
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // mês é 0-indexado
    const ano = dateObj.getFullYear();

    return `${dia}/${mes}/${ano}`;
}
