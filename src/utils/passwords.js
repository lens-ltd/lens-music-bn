import bycrpt from 'bcrypt';

export const hashPassword = async (password) => {
    const salt = await bycrpt.genSalt(10);
    return bycrpt.hash(password, salt);
}

export const comparePassword = async (password, hashedPassword) => {
    return bycrpt.compare(password, hashedPassword);
}
