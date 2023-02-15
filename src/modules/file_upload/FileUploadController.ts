import { FileUploadService } from './FileUploadService';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { FileUpload } from '../../entity/FileUpload';
import { Upload } from '../../shared/types/Upload';
const GraphQLUpload = require('graphql-upload/public/GraphQLUpload.js');

@Resolver()
@Service()
export class FileUploadController {
    constructor(private readonly file_upload_service: FileUploadService) {}

    @Mutation(() => FileUpload, { nullable: true })
    async uploadFile(
        @Arg('file', () => GraphQLUpload)
        file: Upload
    ): Promise<FileUpload | null> {
        return this.file_upload_service.uploadFile(file);
    }
}
