import config from '../Config/dbConfig.js';
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool(config);
import {extractLongLat} from './heatmapControllerHelper.js'

export async function getHeatmap(user_location){
    const { lng, lat } = user_location;
    const query = `SELECT supermarketId, COUNT(supermarketId) as supermarket_count,
    ARRAY_AGG(DISTINCT (user_latitude, user_longitude)) as user_locations,
    ARRAY_AGG(DISTINCT (supermarket_latitude, supermarket_longitude)) as supermarket_locations
    FROM heatmap
    WHERE earth_box(ll_to_earth(${lng}, ${lat}), 10000) @> ll_to_earth(user_longitude, user_latitude)
    GROUP BY supermarketId;
    `;
    const result = (await pool.query(query)).rows;

    const formattedData=result.map((item) => {
        const location=extractLongLat(item.supermarket_locations)
        const user_location=extractLongLat(item.user_locations)
        return {
            count: Number(item.supermarket_count),
            lat: Number(location.lat),
            lng: Number(location.lng),
            user_lat: Number(user_location.lat),
            user_lng: Number(user_location.lng)
        }})
    console.log('formattedData', formattedData)
    return formattedData;
    

}