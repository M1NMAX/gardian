import { useEffect, useState } from 'react';
import { IBaseModel } from '@interfaces';
import { SortOptionType } from '@types';
import sortFun from '../utils';


const useSort = <T extends IBaseModel>(
  initialOption: SortOptionType,
  list: T[]
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
  }, [list]);

  const onChangeSortOption = (option: SortOptionType) => {
    const data = sortedList.slice().sort(sortFun(option.field, option.order));
    setSortedList(data);
    setSelectedSortOption(option);
  };

  return { selectedSortOption, sortedList, onChangeSortOption };
};
export default useSort;
