import { sortIssues } from "../sorting";
import { Issue } from "../../types";

const createMockIssue = (
  id: string,
  severity: number,
  daysAgo: number
): Issue => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return {
    id,
    severity,
    createdAt: date.toISOString(),
    title: `Issue ${id}`,
    status: "Backlog",
    priority: "low",
    assignee: "User",
    tags: [],
  };
};

describe("sortIssues", () => {
  test("should sort issues with highest severity score first", () => {
    const issueA = createMockIssue("A", 5, 1);
    const issueB = createMockIssue("B", 8, 1);
    const issues = [issueA, issueB];
    issues.sort(sortIssues);
    expect(issues[0].id).toBe("B");
    expect(issues[1].id).toBe("A");
  });

  test("should prioritize older issues if severity is equal", () => {
    const issueA = createMockIssue("A", 5, 10);
    const issueB = createMockIssue("B", 5, 2);
    const issues = [issueB, issueA];
    issues.sort(sortIssues);
    expect(issues[0].id).toBe("A");
    expect(issues[1].id).toBe("B");
  });

  test("should prioritize newer issues if scores are identical", () => {
    const RealDate = Date;
    const mockNow = new Date("2025-11-02T23:59:59.000Z");

    // @ts-ignore
    global.Date = class extends RealDate {
      constructor(...args: any[]) {
        if (args.length > 0) {
          // @ts-ignore
          super(...args);
        } else {
          super(mockNow);
        }
      }
    };

    const issueA = createMockIssue("A", 5, 10);

    const issueB = createMockIssue("B", 5, 10);

    issueA.createdAt = new Date("2025-10-23T23:59:58.000Z").toISOString();

    const issues = [issueA, issueB];
    issues.sort(sortIssues);

    expect(issues[0].id).toBe("B");
    expect(issues[1].id).toBe("A");

    global.Date = RealDate;
  });
});
