import { Issue } from "../types";
import dayjs from "dayjs";

const getDaysSinceCreated = (createdAt: string): number => {
  const createdDate = dayjs(createdAt);
  const now = dayjs();

  const diffDays = now.diff(createdDate, "day");

  return Math.max(0, diffDays - 1);
};

const calculatePriorityScore = (issue: Issue): number => {
  const daysFactor = getDaysSinceCreated(issue.createdAt);
  const severityFactor = issue.severity * 10;

  return severityFactor + daysFactor;
};

export const sortIssues = (a: Issue, b: Issue): number => {
  const scoreA = calculatePriorityScore(a);
  const scoreB = calculatePriorityScore(b);

  if (scoreA !== scoreB) {
    return scoreB - scoreA;
  }

  const dateA = dayjs(a.createdAt);
  const dateB = dayjs(b.createdAt);

  return dateB.diff(dateA);
};
