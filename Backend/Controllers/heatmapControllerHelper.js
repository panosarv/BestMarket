export function extractLongLat(locationString) {
    const regex = /-?\d+\.\d+/g; // Matches a sequence of digits, a decimal point, and more digits
    const matches = locationString.match(regex);
    return {lat:matches[0],lng:matches[1]}  // Return the second match, which should be the latitude
}