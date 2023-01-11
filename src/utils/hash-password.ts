import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { PASSWORD_SALT } from './../shared/constants';
config();

export async function hashedPassword(plaintext_password: string): Promise<string> {
    try {
        return await bcrypt.hash(plaintext_password, parseInt(PASSWORD_SALT!));
    } catch (err) {
        throw err;
    }
}
