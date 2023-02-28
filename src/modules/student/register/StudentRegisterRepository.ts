import { StudentApplyJob } from './../../../entity/StudentApplyJob';
import { BaseRepository } from '../../BaseRepository';
import { Student } from '../../../entity/Student';
import { Faculty } from '../../../entity/Faculty';
import { Department } from '../../../entity/Department';
import { Curriculum } from '../../../entity/Curriculum';
import { StudentLanguageAbility } from '../../../entity/StudentLanguageAbility';
import { StudentSkills } from '../../../entity/StudentSkills';
import { TranscriptFileUpload } from '../../../entity/TranscriptFileUpload';

export class StudentRegisterRepository extends BaseRepository<Student> {}
export class StudentFacultyRepository extends BaseRepository<Faculty> {}
export class StudentDepartmentRepository extends BaseRepository<Department> {}
export class StudentCurriculumRepository extends BaseRepository<Curriculum> {}
export class StudentLanguageRepository extends BaseRepository<StudentLanguageAbility> {}
export class StudentSkillsRepository extends BaseRepository<StudentSkills> {}
export class TranscriptUploadRepository extends BaseRepository<TranscriptFileUpload> {}
export class StudentApplyJobRepository extends BaseRepository<StudentApplyJob> {}
