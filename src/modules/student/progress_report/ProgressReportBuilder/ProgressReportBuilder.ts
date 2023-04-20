import { ProgressReport } from '../../../../entity/ProgressReport';

export class ProgressReportBuilder  {
    private report_no: number;
    private commute_score: number;
    private advisement_score: number;
    private work_score: number;
    private other_suggest: string;
    private current_res: string;
    private mentor_name: string;
    private mentor_position: string;
    private mentor_tel: string;
    private mentor_email: string;

  setReportNo(value: number) {
    this.report_no = value;
    return this
  }

  setMentorEmail(val:string){
      this.mentor_email = val
      return this
  }

  setCommuteScore(value: number) {
    this.commute_score = value;
    return this
  }

  setAdvisementScore(value: number) {
    this.advisement_score = value;
    return this
  }

  setWorkScore(value: number) {
    this.work_score = value;
    return this
  }

  setCurrentRes(value: string) {
    this.current_res = value;
    return this
  }

  setMentorName(value: string) {
    this.mentor_name = value;
    return this
  }

  setMentorPosition(value: string) {
    this.mentor_position = value;
    return this
  }

  setOtherSuggest(value: string) {
    this.other_suggest = value;
    return this
  }

  setMentorTel(value: string) {
    this.mentor_tel = value;
    return this
  }



    build() {
        return new ProgressReport(
            this.report_no,
            this.commute_score,
            this.advisement_score,
            this.work_score,
            this.current_res,
            this.mentor_name,
            this.mentor_position,
            this.other_suggest,
            this.mentor_tel,
            this.mentor_email
        );
    }
}
