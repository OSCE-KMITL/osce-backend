import { JobInputByCompany, UpdateJobInput, JobInputByCommittee } from './args/JobInput';
import { Job } from './../../entity/Job';
import { JobService } from './JobService';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { Announcement } from '../../entity/Announcement';
import { GetWithKeyInput } from '../../shared/args/GetWithKeyInput';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { useAuthorization } from '../../middleware/useAuthorization';
import { RoleOption } from '../../shared/types/Roles';
import { AppContext } from '../../shared/types/context-types';

@Resolver()
@Service()
export class JobController {
    constructor(private readonly job_service: JobService) {}

    @Query(() => [Job], { nullable: 'items' })
    async getAllJob(): Promise<Job[] | null> {
        try {
            return this.job_service.getAllJob();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    @Query(() => Job, { nullable: true })
    async getJobById(@Arg('job_id') job_id: string): Promise<Job | null> {
        return this.job_service.getById(job_id);
    }

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE]))
    @Mutation(() => Job, { nullable: true })
    async createJobByCommittee(@Arg('job_info') job_info: JobInputByCommittee, @Ctx() { req }: AppContext): Promise<Job | null> {
        const { user_id } = req;
        return this.job_service.createJobByCommittee(job_info, user_id!);
    }

    @UseMiddleware(useAuthorization([RoleOption.COMPANY]))
    @Mutation(() => Job, { nullable: true })
    async createJobByCompany(@Arg('job_info') job_info: JobInputByCompany, @Ctx() { req }: AppContext): Promise<Job | null> {
        const { user_id } = req;
        return this.job_service.createJobByCompany(job_info, user_id!);
    }

    @UseMiddleware(useAuthorization([RoleOption.COMMITTEE, RoleOption.COMPANY]))
    @Mutation(() => Job, { nullable: true })
    async deleteJob(@Arg('job_id') job_id: string, @Ctx() { req }: AppContext): Promise<Job | null> {
        const { user_id } = req;
        return this.job_service.deleteJob(job_id, user_id!);
    }

    @Mutation(() => Job, { nullable: true })
    async updateJob(@Arg('update_input') update_input: UpdateJobInput, @Ctx() { req }: AppContext): Promise<Job | null> {
        const { user_id } = req;
        return this.job_service.updateJob(update_input, user_id!);
    }
}
