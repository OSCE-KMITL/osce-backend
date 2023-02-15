import { FileUpload } from './../../entity/FileUpload';
import { FileUploadRepository } from './FileUploadRepository';
import { Service } from 'typedi';
import { createWriteStream } from 'fs';
import { Upload } from '../../shared/types/Upload';
import path from 'path';
import { PORT } from '../../shared/constants';
import { generateRandomString } from '../../utils/random-string';

@Service()
export class FileUploadService {
    constructor(private readonly file_upload_repository = new FileUploadRepository(FileUpload)) {}

    async uploadFile(file: Upload) {
        const { createReadStream, filename, mimetype, encoding } = await file;
        const { ext } = path.parse(filename);
        const random_name = generateRandomString(12) + ext;
        const original_name = filename;
        const current_name = random_name;
        const url = `http://localhost:${PORT}/files/${current_name}`;

        try {
            createReadStream().pipe(createWriteStream(__dirname + `/../../../public/files/${random_name}`));
        } catch (error) {
            throw new Error('error save file');
        }

        const saved_file = await this.file_upload_repository.save(new FileUpload(original_name, current_name, url));

        return saved_file;
    }
}
