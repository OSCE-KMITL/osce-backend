import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { ProgressReportService } from './ProgressReportService';
import { ProgressReport } from '../../../entity/ProgressReport';
import { ProgressReportInput } from './args';

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
    async createProgressReport(@Arg('progress_report_arg') payload: ProgressReportInput): Promise<ProgressReport> {
        const student_id = '63015208';
        return this.progress_report_service.createProgressReport(payload, student_id);
    }

    @Mutation(() => ProgressReport, { nullable: true })
    async deleteProgressReport(@Arg('report_id') report_id: string): Promise<ProgressReport | null> {
        const student_id = '63015208';
        return this.progress_report_service.deleteProgressReport(report_id,student_id)
    }
}
