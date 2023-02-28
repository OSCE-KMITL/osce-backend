import { registerEnumType } from 'type-graphql';

export enum JobStatus {
    STUDENTAPPLIED = 'รอการตอบรับ',
    COMPANYAPPROVE = 'รอการอนุมัติ',
    COMPANYCANCEL = 'ปฏิเสธการตอบรับ',
    COMMITTEEAPPROVE = 'ได้รับงาน',
    COMMITTEECANCEL = 'ปฏิเสธโดยกรรมการ',
}

registerEnumType(JobStatus, {
    name: 'JobStatus', // this one is mandatory
    description: 'status of job applying', // this one is optional
});
