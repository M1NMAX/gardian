import { SORT_ASCENDING } from '@constants';
import { IBaseModel } from '@interfaces';
import { FieldType, OrderType } from '@types';


const sortDate = <T extends IBaseModel>(a: T, b: T, field: 'createdAt') => {
  const l = a[field];
  const r = b[field];

  if (!l) return 1;
  else if (!r) return -1;

  const lx = l.getTime();
  const rx = r.getTime();

  return lx < rx ? -1 : lx > rx ? 1 : 0;
};

const sortString = <T extends IBaseModel>(a: T, b: T, field: 'name') => {
  const l = field ? a[field] : a;
  const r = field ? b[field] : b;

  if (!l) return 1;
  else if (!r) return -1;

  return l < r ? -1 : l > r ? 1 : 0;
};

const sortFun = (field: FieldType, order: OrderType) => {
  return <T extends IBaseModel>(a: T, b: T) => {
    if (a[field] === b[field]) return 0;

    let result: number = 0;

    if (typeof a[field] === 'string') result = sortString(a, b, 'name');
    else if (a[field] instanceof Date) result = sortDate(a, b, 'createdAt');

    return order === SORT_ASCENDING ? +result : -result;
  };
};

export { sortFun as default };
