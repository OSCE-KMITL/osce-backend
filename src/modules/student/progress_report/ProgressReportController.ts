import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { ProgressReportService } from './ProgressReportService';
import { ProgressReport } from '../../../entity/ProgressReport';
import { ProgressReportInput } from './args';
import { AppContext } from '../../../shared/types/context-types';

@Resolver()
@Service()
export class ProgressReportController {
    constructor(private readonly progress_report_service: ProgressReportService) {}

    @Query(() => [ProgressReport], { nullable: 'items' })
    async getProgressReports(): Promise<ProgressReport[]> {
        try {
            return this.progress_report_service.getProgressReports();
        } catch (e) {
            throw e;
        }
    }

    @Query(() => ProgressReport, { nullable: true })
    async getProgressReport(@Arg('id') id: string): Promise<ProgressReport | null> {
        try {
            return this.progress_report_service.getProgressReport(id);
        } catch (e) {
            throw e;
        }
    }

    @Mutation(() => ProgressReport, { nullable: true })
    async createProgressReport(@Arg('progress_report_arg') payload: ProgressReportInput, @Ctx() { req }: AppContext): Promise<ProgressReport> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.progress_report_service.createProgressReport(payload, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    @Mutation(() => ProgressReport, { nullable: true })
    async deleteProgressReport(@Arg('report_id') report_id: string, @Ctx() { req }: AppContext): Promise<ProgressReport | null> {
        try {
            const { user_id } = req;
            if (!user_id) {
                throw new Error('เข้าสู่ระบบก่อนทำรายการ');
            }
            return this.progress_report_service.deleteProgressReport(report_id, user_id);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
