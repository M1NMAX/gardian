import { ICollection, IItem, ITemplate } from '../interfaces';

type OrderType = 'asc' | 'desc';
type FieldType = 'name' | 'createdAt';
type ABTypes = ITemplate | ICollection | IItem;

export type SortOptionType = { field: FieldType; order: OrderType };

export const SORT_ASCENDING: OrderType = 'asc';
export const SORT_DESCENDING: OrderType = 'desc';

const sortDate = (a: ABTypes, b: ABTypes, field: 'createdAt') => {
  const l = a[field];
  const r = b[field];

  if (!l) return 1;
  else if (!r) return -1;

  const lx = l.getTime();
  const rx = r.getTime();

  return lx < rx ? -1 : lx > rx ? 1 : 0;
};

const sortString = (a: ABTypes, b: ABTypes, field: 'name') => {
  const l = field ? a[field] : a;
  const r = field ? b[field] : b;

  if (!l) return 1;
  else if (!r) return -1;

  return l < r ? -1 : l > r ? 1 : 0;
};

const sortFun = (order: OrderType, field: FieldType) => {
  return (a: ABTypes, b: ABTypes) => {
    if (a[field] === b[field]) return 0;

    let result: number = 0;

    if (typeof a[field] === 'string') result = sortString(a, b, 'name');
    else if (a[field] instanceof Date) result = sortDate(a, b, 'createdAt');

    return order === SORT_ASCENDING ? +result : -result;
  };
};

export { sortFun as default };
