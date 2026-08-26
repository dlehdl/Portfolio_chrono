import { text } from './index';
import type { PassiveNode, SkillTree, Stance, ActiveSkillDetail, ComboStep, EvolutionNode } from '../types';

/** text.md passives 맵으로 PassiveNode 텍스트 필드 덮어쓰기 */
export function applyPassiveTexts(nodes: PassiveNode[]): PassiveNode[] {
  const map = (text.passives ?? {}) as Record<string, Partial<PassiveNode>>;
  return nodes.map((node) => {
    const overlay = map[node.id];
    if (!overlay) return node;
    return {
      ...node,
      name: overlay.name ?? node.name,
      summary: overlay.summary ?? node.summary,
      description: overlay.description ?? node.description,
      designerIntent: overlay.designerIntent ?? node.designerIntent,
      tags: overlay.tags ?? node.tags,
    };
  });
}

const WEAPON_SLUGS = ['chainsword', 'dualaxe', 'battleaxe'] as const;

function applyStanceTexts(stances: Stance[], weaponSlug: string): Stance[] {
  const weapon = text.weapons?.[weaponSlug];
  const map = (weapon?.stances ?? {}) as Record<string, Partial<Stance>>;
  return stances.map((s) => {
    const o = map[s.id];
    if (!o) return s;
    return {
      ...s,
      name: o.name ?? s.name,
      concept: o.concept ?? s.concept,
      keywords: o.keywords ?? s.keywords,
      description: o.description ?? s.description,
      flowSteps: o.flowSteps ?? s.flowSteps,
      descriptionPoints: o.descriptionPoints ?? s.descriptionPoints,
      furyTrigger: o.furyTrigger ?? s.furyTrigger,
      furyEffect: o.furyEffect ?? s.furyEffect,
      furyRisk: o.furyRisk ?? s.furyRisk,
    };
  });
}

function applyEvolutionNode(n: EvolutionNode, on?: any): EvolutionNode {
  if (!on) return n;
  const resource = on.resource ?? on.specOverride?.resource;
  return {
    ...n,
    name: on.name ?? n.name,
    description: on.description ?? n.description,
    insight: on.insight ?? n.insight,
    specOverride:
      resource != null || on.specOverride || n.specOverride
        ? {
            ...n.specOverride,
            ...on.specOverride,
            ...(resource != null ? { resource } : {}),
          }
        : n.specOverride,
  };
}

function applySkillTexts(skills: ActiveSkillDetail[], weaponSlug: string): ActiveSkillDetail[] {
  const map = (text.weapons?.[weaponSlug]?.skills ?? {}) as Record<string, any>;
  return skills.map((skill) => {
    const o = map[skill.id];
    if (!o) return skill;
    const next: ActiveSkillDetail = {
      ...skill,
      name: o.name ?? skill.name,
      description: o.baseDescription ?? o.description ?? skill.description,
      designIntent: o.designIntent ?? skill.designIntent,
      meaningfulChoice: o.meaningfulChoice ?? skill.meaningfulChoice,
      specs: {
        ...skill.specs,
        resource: o.resource ?? o.specs?.resource ?? skill.specs.resource,
      },
    };
    if (o.evolution && skill.evolution) {
      next.evolution = {
        pathA: {
          name: o.evolution.pathA?.name ?? skill.evolution.pathA.name,
          concept: o.evolution.pathA?.concept ?? skill.evolution.pathA.concept,
          nodes: skill.evolution.pathA.nodes.map((n, i) => applyEvolutionNode(n, o.evolution.pathA?.nodes?.[i])),
        },
        pathB: {
          name: o.evolution.pathB?.name ?? skill.evolution.pathB.name,
          concept: o.evolution.pathB?.concept ?? skill.evolution.pathB.concept,
          nodes: skill.evolution.pathB.nodes.map((n, i) => applyEvolutionNode(n, o.evolution.pathB?.nodes?.[i])),
        },
      };
    }
    return next;
  });
}

function applyComboSteps(
  steps: ComboStep[],
  overlays?: Array<{ step?: number; name?: string; description?: string; designIntent?: string }>,
): ComboStep[] {
  if (!overlays?.length) return steps;
  return steps.map((step) => {
    const o = overlays.find((x) => x.step === step.step) ?? overlays[step.step - 1];
    if (!o) return step;
    return {
      ...step,
      name: o.name ?? step.name,
      description: o.description ?? step.description,
      designIntent: o.designIntent ?? step.designIntent,
    };
  });
}

/** WEAPON_DATA 배열에 text.md weapons 텍스트 적용 */
export function applyWeaponTexts(weapons: SkillTree[]): SkillTree[] {
  return weapons.map((weapon, index) => {
    const slug = WEAPON_SLUGS[index];
    const w = text.weapons?.[slug];
    if (!w) return weapon;

    const special = w.specialAction ?? {};
    return {
      ...weapon,
      name: w.name ?? weapon.name,
      description: w.description ?? weapon.description,
      mechanic: w.mechanic ?? weapon.mechanic,
      basicAttack: {
        ...weapon.basicAttack,
        name: w.basicAttack?.name ?? weapon.basicAttack.name,
        description: w.basicAttack?.description ?? weapon.basicAttack.description,
        steps: applyComboSteps(weapon.basicAttack.steps, w.basicAttack?.steps),
      },
      specialAction: {
        ...weapon.specialAction,
        name: special.name ?? weapon.specialAction.name,
        description: special.description ?? weapon.specialAction.description,
        mechanic: special.mechanic ?? weapon.specialAction.mechanic,
        designIntent: special.designIntent ?? weapon.specialAction.designIntent,
        frameDataLabel: special.frameDataLabel ?? weapon.specialAction.frameDataLabel,
        frameDataAlt: weapon.specialAction.frameDataAlt
          ? {
              ...weapon.specialAction.frameDataAlt,
              label: special.frameDataAltLabel ?? weapon.specialAction.frameDataAlt.label,
            }
          : weapon.specialAction.frameDataAlt,
      },
      movementAttackSteps: weapon.movementAttackSteps
        ? applyComboSteps(weapon.movementAttackSteps, w.movementAttackSteps)
        : weapon.movementAttackSteps,
      stances: applyStanceTexts(weapon.stances, slug),
      activeSkills: applySkillTexts(weapon.activeSkills, slug),
      passiveTree: weapon.passiveTree ? applyPassiveTexts(weapon.passiveTree) : weapon.passiveTree,
    };
  });
}

export function getNavItemsFromText(): { id: string; label: string }[] {
  return (text.nav?.items ?? []) as { id: string; label: string }[];
}
