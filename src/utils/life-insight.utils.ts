import { Area, Category } from "@models/data.models";

export const mapCategoriesToAreas = (data: Category[], dataSource?: Area[], firstActive: boolean = false): Area[] => {
  return data.map(({ id, name, displayName, tooltipKey, allNames }: any, index: number, { length }) => {
    let source;

    if (dataSource) {
      source = dataSource.find((item: Area) => item.id === id || item.name === name || allNames && allNames.includes(item.name.replace('&amp;', '&')));
    }

    return {
      id,
      index,
      name,
      displayName,
      tooltipKey,
      value: source?.value ?? 0,
      desiredValue: source?.desiredValue ?? 0,
      monthsPeriod: source?.monthsPeriod,
      active: firstActive ? index === 0 : false,
      isLast: index === length - 1,
    };
  });
} 