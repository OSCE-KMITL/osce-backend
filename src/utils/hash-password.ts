import bcrypt from 'bcrypt';
import { config } from 'dotenv';
config();

const { PASSWORD_SALT } = process.env || 10;
export async function hashedPassword(plaintext_password: string): Promise<string> {
    try {
        return await bcrypt.hash(plaintext_password, parseInt(PASSWORD_SALT!));
    } catch (err) {
        throw err;
    }
}
