export default class EmailExtractor {
    static getStudentId(email: string) {
        try {
            const extracted = email.split('@');
            return extracted[0];
        } catch (error) {
            console.log('cant not extract this email');
        }
    }
}
