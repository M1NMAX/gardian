import { useEffect, useState } from 'react';
import { IBaseModel } from '@interfaces';
import { SortOptionType } from '@types';
import sortFun from '../utils';


const useSort = <T extends IBaseModel, P>(
  initialOption: SortOptionType,
  list: T[],
  deps: P
) => {
  const [selectedSortOption, setSelectedSortOption] =
    useState<SortOptionType>(initialOption);

  const [sortedList, setSortedList] = useState<T[]>([]);

  useEffect(() => {
    setSortedList(
      list
        .slice()
        .sort(sortFun(selectedSortOption.field, selectedSortOption.order))
    );
  }, [deps]);

  const reorder = (list?: T[]) => {
    const { field, order } = selectedSortOption;
    const listToSort = list ?? sortedList;
    const data = listToSort.slice().sort(sortFun(field, order));
    setSortedList(data);
  };

  const onChangeSortOption = (option: SortOptionType) => {
    const data = sortedList.slice().sort(sortFun(option.field, option.order));
    setSortedList(data);
    setSelectedSortOption(option);
  };

  return { selectedSortOption, sortedList, reorder, onChangeSortOption };
};
export default useSort;
