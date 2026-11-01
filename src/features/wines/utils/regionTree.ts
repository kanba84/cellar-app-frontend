import type { Region } from "@/types/api/region";

export function getRegionAndDescendantIds(
  regions: Region[],
  selectedRegionId: number,
): Set<number> {
  const childrenByParentId = new Map<number, number[]>();
  for (const region of regions) {
    if (region.parent_id === null) continue;
    const children = childrenByParentId.get(region.parent_id) ?? [];
    children.push(region.id);
    childrenByParentId.set(region.parent_id, children);
  }

  const result = new Set<number>();
  const pending = [selectedRegionId];
  while (pending.length > 0) {
    const regionId = pending.pop()!;
    if (result.has(regionId)) continue;
    result.add(regionId);
    pending.push(...(childrenByParentId.get(regionId) ?? []));
  }
  return result;
}

export function getAppellationIdsForRegions(
  appellations: {
    id: number;
    region_id?: number | null;
    regions?: Pick<Region, "id">[];
  }[],
  regionIds: Set<number>,
): Set<number> {
  return new Set(
    appellations
      .filter(
        (appellation) =>
          (appellation.regions ?? []).some((region) =>
            regionIds.has(Number(region.id)),
          ) ||
          (appellation.region_id != null &&
            regionIds.has(Number(appellation.region_id))),
      )
      .map((appellation) => Number(appellation.id)),
  );
}

export function getRegionLabel(region: Region, regions: Region[]): string {
  const byId = new Map(regions.map((item) => [item.id, item]));
  const path: string[] = [];
  const visited = new Set<number>();
  let current: Region | undefined = region;

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    path.unshift(current.name);
    current = current.parent_id === null ? undefined : byId.get(current.parent_id);
  }

  const countryName = region.country?.name;
  return countryName ? `${countryName} · ${path.join(" › ")}` : path.join(" › ");
}
