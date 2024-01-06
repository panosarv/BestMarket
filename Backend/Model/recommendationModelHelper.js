export function combine(lists, combination, allCombinations,lengthOfLists) {
    if (lists.length === 0) {
      if (combination.length >= lengthOfLists && allCombinations.includes(combination) === false) {
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

export function calculateCostOfCart(cart,supermarketId){
    let cost=0;
    for (const item of cart){
        if(item.supermarketid===supermarketId){
            cost+=Number(item.price);
        }
    }
    return cost;
}

