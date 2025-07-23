export const validatePassword = (password) => {
    const errors = [];

    if (password.length < 6) {
        errors.push("A senha deve ter pelo menos 6 caracteres.");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("A senha deve conter pelo menos uma letra maiúscula.");
    }

    if (!/[0-9]/.test(password)) {
        errors.push("A senha deve conter pelo menos um número.");
    }

    if (/[çáàâãéèêíïóôõöúüñ]/i.test(password)) {
        errors.push("A senha não deve conter acentos ou letras especiais como ç.");
    }

    if (/[^a-zA-Z0-9!@#$%^&*()_\-+=\[\]{}|:;'",.<>/?\\~`]/.test(password)) {
        errors.push("A senha contém caracteres inválidos.");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
