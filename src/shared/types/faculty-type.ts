
export interface IFaculty {
    faculty_id: string;
    faculty_name_th: string;
    faculty_name_en: string;
}
export interface ICurriculum {
    level_id: string;
    faculty_id:string
    department_id: string
    curriculum_id: string;
    curriculum_name_th: string;
    curriculum_name_en: string;
}
export interface IDepartment {
    faculty_id: string
    department_id: string;
    department_name_th: string;
    department_name_en: string;
}
