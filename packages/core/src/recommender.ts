import type {
  HarnessId,
  McpEntry,
  SkillEntry,
  StackProfile,
} from "./schemas.js";

export interface RecommendInput {
  stack: StackProfile;
  harnesses: HarnessId[];
  tier: "recommended" | "all";
  allSkills: SkillEntry[];
  allMcps: McpEntry[];
}

export interface Recommendation {
  skills: SkillEntry[];
  mcps: McpEntry[];
}

export function recommend(input: RecommendInput): Recommendation {
  const { stack, harnesses, tier, allSkills, allMcps } = input;

  const skillIds = new Set(stack.recommendedSkills);
  const mcpIds = new Set(stack.recommendedMcps);

  const skillsFiltered = allSkills.filter((s) => {
    if (s.harnesses.length > 0 && !s.harnesses.some((h) => harnesses.includes(h))) {
      return false;
    }
    if (tier === "recommended") {
      return skillIds.has(s.id) || (s.recommended && s.stacks.includes(stack.id));
    }
    return skillIds.has(s.id) || s.stacks.includes(stack.id) || s.stacks.length === 0;
  });

  const mcpsFiltered = allMcps.filter((m) => {
    if (tier === "recommended") {
      return mcpIds.has(m.id) || (m.recommended && m.stacks.includes(stack.id));
    }
    return mcpIds.has(m.id) || m.stacks.includes(stack.id) || m.stacks.length === 0;
  });

  const skills = dedupeById(skillsFiltered);
  const mcps = dedupeById(mcpsFiltered);

  return { skills, mcps };
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}
