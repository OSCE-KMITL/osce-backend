import { registerEnumType } from "type-graphql";
export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
  ADVISOR = "advisor",
  COMPANY = "company",
}

registerEnumType(UserRole, {
  name: "UserRole", // this one is mandatory
  description: "Roles of user", // this one is optional
});