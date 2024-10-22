export const hash = async (id: string) => {
    return await Bun.password.hash(id);
}

export const verify = async (id: string, hashed: string) => {
    return await Bun.password.verify(id, hashed);
}