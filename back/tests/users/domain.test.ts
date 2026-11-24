import {expect,test} from "vitest";
import {parseAdminEmails,resolveRole} from "../../convex/users/domain";
test("parses a comma separated list",()=>{expect(parseAdminEmails(" A@x.com, b@y.com ,, ")).toEqual(["a@x.com","b@y.com"]);});
test("listed email is admin, case insensitive",()=>{expect(resolveRole("Boss@X.com","boss@x.com")).toBe("admin");});
test("unlisted or missing email is a plain user",()=>{expect(resolveRole("a@x.com","boss@x.com")).toBe("user");expect(resolveRole(undefined,"boss@x.com")).toBe("user");expect(resolveRole("a@x.com",undefined)).toBe("user");});
