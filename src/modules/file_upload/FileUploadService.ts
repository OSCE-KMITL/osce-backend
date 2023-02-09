import { FileUpload } from './../../entity/FileUpload';
import { FileUploadRepository } from './FileUploadRepository';
import { AccountRepository } from './../account/AccountRepository';
import { FileUploadInput } from './args/FileUploadInput';
const GraphQLUpload = require('graphql-upload/public/GraphQLUpload.js');
const { processRequest } = require('graphql-upload');
import { Service } from 'typedi';
import { Mutation, Arg } from 'type-graphql';
import { createWriteStream } from 'fs';
import { Upload } from '../../shared/types/Upload';
import { Account } from '../../entity/Account';
import path from 'path';
import { PORT } from '../../shared/constants';

function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

@Service()
export class FileUploadService {
    constructor(
        private readonly account_repository = new AccountRepository(Account),
        private readonly file_upload_repository = new FileUploadRepository(FileUpload)
    ) {}

    async uploadFile(file: Upload) {
        const { createReadStream, filename, mimetype, encoding } = await file;
        const { ext } = path.parse(filename);
        const random_name = generateRandomString(12) + ext;
        const original_name = filename;
        const current_name = random_name;
        const url = `http://localhost:${PORT}/files/${current_name}`;

        // const account = await this.account_repository.findOne('id', account_id);
        // if (!account) throw new Error('ไม่มีสิทธิ์เข้าถึง');

        try {
            createReadStream().pipe(createWriteStream(__dirname + `/../../../public/files/${random_name}`));
        } catch (error) {
            throw new Error('error save file');
        }

        const saved_file = await this.file_upload_repository.save(new FileUpload(original_name, current_name, url));

        return saved_file;
    }
}

// @Mutation(() => Boolean)
// async uploadFiles(
//     @Arg('picture', () => GraphQLUpload)
//     { createReadStream, filename, mimetype, encoding }: Upload
// ): Promise<boolean> {
//     return new Promise(async (resolve, reject) =>
//         createReadStream()
//             .pipe(createWriteStream(__dirname + `/../../../files/${filename}`))
//             .on('finish', () => {
//                 console.log('finish'), resolve(true);
//             })
//             .on('error', () => {
//                 console.log('error'), reject(false);
//             })
//     );
// }
