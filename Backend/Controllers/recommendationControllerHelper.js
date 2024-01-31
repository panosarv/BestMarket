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
export function recommendSupermarket(supermarkets,weather,meansOfTransport){
    console.log("supermarkets", supermarkets)
    console.log("weather.toLowerCase()", weather.toLowerCase())
    console.log("meansOfTransport", meansOfTransport) 
    
    let maxCost=Math.max(...supermarkets.map(item => item.cost));
    let maxDistance=Math.max(...supermarkets.map(item => item.distance));
    console.log("maxCost", maxCost)
    console.log("maxDistace", maxDistance)
    let dateNow = new Date().getHours();

    let score= supermarkets.map(item => {
        let costScore = 1 - (item.cost/maxCost);
        let distanceScore = maxDistance!=0?1 - (item.distance/maxDistance):0;
        console.log("costScore", costScore)
        
        if(weather.toLowerCase().includes("thunder")||weather.toLowerCase().includes("storm")){
          distanceScore+=0.2;
          if(meansOfTransport=="walking"){
            distanceScore+=0.4;
          }
          else if(meansOfTransport=="bike"){
           distanceScore+=0.4;
          }
          else if(meansOfTransport=="motorbike"){
            distanceScore+=0.3;
          }
        }
        if(weather.toLowerCase().includes("rain")||weather.toLowerCase().includes("snow")){
          distanceScore+=0.1;
          if(meansOfTransport=="walking"){
            distanceScore+=0.3;
          }
          else if(meansOfTransport=="bike"){
           distanceScore+=0.3;
          }
          else if(meansOfTransport=="bike"){
            distanceScore+=0.1;
          }
        }
        if(weather.toLowerCase().includes("cloud")||weather.toLowerCase().includes("overcast")||weather.toLowerCase().includes("fog")||weather.toLowerCase().includes("mist")||weather.toLowerCase().includes("haze")||weather.toLowerCase().includes("drizzle")){
          if(meansOfTransport=="walking"){
            distanceScore+=0.1;
          }
          else if(meansOfTransport=="bike"){
           distanceScore+=0.05;
          }
          else if(meansOfTransport=="bike"){
            distanceScore+=0.05;
          }
          else if(meansOfTransport=="bike"){
            distanceScore-=0.2;
          }
        }
        if (dateNow>=20){
          if(meansOfTransport=="walking"){
            distanceScore+=0.4;
          }
          else if(meansOfTransport=="bike"){
           distanceScore+=0.2;
          }
        }
        if(weather.toLowerCase().includes("sun")){
          distanceScore-=0.2;
          if(meansOfTransport=="bike"){
            distanceScore-=0.2;
          }
        }
        let finalScore = costScore+distanceScore;
        return {...item,score:finalScore};
          
        
    });
    console.log("score", score)
    let sortedSupermarkets = score.sort((a,b) => b.score-a.score); 
    return sortedSupermarkets;
}


