import { FileUploadInput } from './args/FileUploadInput';
import { FileUploadService } from './FileUploadService';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { Announcement } from '../../entity/Announcement';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { useAuthorization } from '../../middleware/useAuthorization';
import { RoleOption } from '../../shared/types/Roles';
import { AppContext } from '../../shared/types/context-types';
import { FileUpload } from '../../entity/FileUpload';
import { Upload } from '../../shared/types/Upload';
const GraphQLUpload = require('graphql-upload/public/GraphQLUpload.js');

@Resolver()
@Service()
export class FileUploadController {
    constructor(private readonly file_upload_service: FileUploadService) {}

    // @UseMiddleware(useAuthorization([RoleOption.COMMITTEE, RoleOption.STUDENT, RoleOption.ADVISOR, RoleOption.COMPANY]))
    @Mutation(() => FileUpload, { nullable: true })
    async uploadFile(
        @Arg('file', () => GraphQLUpload)
        file: Upload,
        // @Arg('file_info')
        // file_info: FileUploadInput
        // @Ctx() { req }: AppContext
    ): Promise<FileUpload | null> {
        // const { user_id } = req;
        // return this.file_upload_service.uploadFile(file_info, user_id!);
        return this.file_upload_service.uploadFile(file);
    }
}
