export function combine(lists, combination, allCombinations,lengthOfLists) {
    if (lists.length === 0) {
      if (combination.length >= lengthOfLists) {
        allCombinations.push(combination);
      }
    } else {
      let [firstList, ...restLists] = lists;
      for (let element of firstList) {
        combine(restLists, [...combination, element], allCombinations,lengthOfLists);
      }
      combine(restLists, combination, allCombinations);
    }
  }