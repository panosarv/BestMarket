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

export function calculateCostOfCart(productQuantity,cart,supermarketId){
    let cost=0;
    for (const item of cart){
        if(item.supermarketid===supermarketId){
            let quantity=productQuantity.find(product=>product.productid===item.productid).quantity;
            console.log("quantity",quantity)
            cost+=Number(item.price)*quantity;
        }
    }
    return cost;
}

export function formatSupermarketData(supermarkets,weather,meansOfTransport){
    let weatherConditionCode=2;
    let dateNow = new Date().getHours();
    dateNow = String(dateNow)+String(new Date().getMinutes());
    dateNow = Number(dateNow);
    let meansOfTransportCode=3;
    if(weather.toLowerCase().includes("thunder")||weather.toLowerCase().includes("storm")){
      weatherConditionCode=0;
    }
    else if(weather.toLowerCase().includes("rain")||weather.toLowerCase().includes("snow")){
      weatherConditionCode=1;
    }
    else if(weather.toLowerCase().includes("cloud")||weather.toLowerCase().includes("overcast")||weather.toLowerCase().includes("fog")||weather.toLowerCase().includes("mist")||weather.toLowerCase().includes("haze")||weather.toLowerCase().includes("drizzle")){
      weatherConditionCode=2;
    }
    else if(weather.toLowerCase().includes("sun")){
      weatherConditionCode=3;
    }
    if (meansOfTransport=="walking"){
      meansOfTransportCode=0;
    }
    else if(meansOfTransport=="bike"){
      meansOfTransportCode=1;
    }
    else if(meansOfTransport=="motorbike"){
      meansOfTransportCode=2;
    }
    else if(meansOfTransport=="public"){
      meansOfTransportCode=3;
    }
    else if(meansOfTransport=="car"){
      meansOfTransportCode=4;
    }
    const formattedSupermarkets = supermarkets.map((item) => {
        return {
            name: item.name,
            timeOfDay: dateNow,
            distance: item.distance,
            weatherCondition: weatherConditionCode,
            meansOfTransport: meansOfTransportCode,
            cost: item.cost,
            rating: item.rating
        }
        
    });
    return formattedSupermarkets;
}




export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c *1000; // Distance in m
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}