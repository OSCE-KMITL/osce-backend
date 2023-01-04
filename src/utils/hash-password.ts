import bcrypt from 'bcrypt';

export async function hashedPassword(plaintext_password: string): Promise<string> {
    try {
        return await bcrypt.hash(plaintext_password, 10);
    } catch (err) {
        throw err;
    }
}
