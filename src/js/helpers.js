import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';


/**
 * Generates promise with timeout function which rejects after specified number of seconds
 * @param {number} s number of seconds for timeout function
 * @returns new promise with timeout function for rejection
 * @author Marko Šterk
 */
const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

/**
 * 
 * @param {string} url url string for fetch get request 
 * @returns {object} recipe data from API
 * @author Marko Šterk
 */
export const getJSON = async function(url) {
    try{
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    }
    catch (err) {
        throw err;
    } 
}

/**
 * Sends recipe data to API
 * @param {string} url url string for post fetch request
 * @param {Object} recipe recipe data for sending with fetch
 * @returns {Object} submited recipe data from API
 * @author Marko Šterk
 */
export const sendJSON = async function(url, recipe) {
  try{
      const res = await Promise.race([fetch(url, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(recipe)
                        }),
                        timeout(TIMEOUT_SEC)]);

      const data = await res.json();
      if(!res.ok) throw new Error(`${data.message} (${res.status})`);
      return data;
  }
  catch (err) {
      throw err;
  } 
}