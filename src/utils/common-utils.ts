import {Account} from "../entity/Account";
import {RoleOption} from "../shared/types/Roles";

export function roleValidation(account:Account , role:RoleOption) {
    if(account?.role !== role) throw new Error("คุณไม่มีสิทธิเข้าถึง")
}