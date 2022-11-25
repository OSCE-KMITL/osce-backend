import { MySqlDataSource } from "../../../ormconfig";
import { Advisor } from "../../entities/Advisor";
import { TestUtils } from "../../test-utils/TestUtils";
import {  omit } from "ramda";
const mock = [
  {
    email: "oath111@gmail.com",
    fullName: "oath1",
    password: "123456789",
    faculty: "engineer",
  },  {
    email: "oath222@gmail.com",
    fullName: "oath2",
    password: "123456789",
    faculty: "it",
  },
];

beforeAll(async () => {
  await MySqlDataSource.initialize();
  const service = MySqlDataSource.getRepository(Advisor);
  const u1= await new Advisor(mock[0].email , mock[0].password ,mock[0].fullName ,mock[0].faculty)
  await service.save(u1)
  const u2= await new Advisor(mock[1].email , mock[1].password ,mock[1].fullName ,mock[1].faculty)
  await service.save(u2)
  for (const data of mock) {
  }
});

afterAll(async () => {
  console.log("hi =========>")
  await MySqlDataSource.dropDatabase()
  await MySqlDataSource.destroy()
});

const query_all_statement = `query Query {
  getAllAdvisorAccounts {
    email
    fullName
    faculty
  }
}
`;

const fomatResult = (result: any) => {
  return result.data.getAllAdvisorAccounts.map(omit(["id", "password"]));
};

describe("advisor query", () => {
  test("it's should query to database", async () => {
    const expected = [
      {
        email: "oath111@gmail.com",
        fullName: "oath1",
        faculty: "engineer",
      }  ,{
        email: "oath222@gmail.com",
        fullName: "oath2",
        faculty: "it",
      }
    ];
    const result = await TestUtils.executeGraphQL({
      source: query_all_statement,
    });
    const actual = fomatResult(result);
    expect(actual).toEqual(expected);
  });
  test("it's should return null when assign wrong value" ,async () => {
    const result = await TestUtils.executeGraphQL({
      source:query_all_statement,
      variableValues:{
        target:"faculty",
        value:"5555"
      }
    })
    expect(result.data).toEqual([])
  })
});
