/**
 * Gets Character Information from the Warcraft Logs API
 *
 * @param characterName The name of the in-game character
 * @param serverName The name of the server that the in-game character is on
 * @param serverRegion The region of the server
 * @param raidSize Size of the raid (10 or 25)
 * @param role Role you want to use to show parses for this character (Any, DPS, Healer, Tank)
 * @return A parseable JSON response from the Warcraft Logs API
 * @customfunction
 */

function test() {
    const data = getCharacterData('Chasedp', 'Healer', 1002);
    Logger.log(data);
}

function getMedianPerformanceAverage (char, role = 'DPS', zoneID = 1020, serverName = 'Faerlina', serverRegion = 'US', raidSize = 25) {
    const data = getCharacterData(char, role, zoneID, serverName, serverRegion, raidSize);
    const median = parseProperty(data, 'medianPerformanceAverage');
    return median;
}

const TOKEN = getAccessToken();

function getCharacterData(characterName, role, zoneID, serverName = 'Faerlina', serverRegion = 'US', raidSize = 25) {
    const query = `
      query {
        characterData {
          character(name: "${characterName}", serverSlug: "${serverName}", serverRegion: "${serverRegion}") {
            id
            canonicalID
            classID
            server {
              name
            }
            faction {
              id
              name
            }
            zoneRankings(zoneID: ${zoneID}, size: ${raidSize}, role: ${role}) 
          }     
        }
      }`;
  
    const ql = 'https://classic.warcraftlogs.com/api/v2/client';
    const response = UrlFetchApp.fetch(ql, {
      method: "GET",
      contentType: 'application/json', 
      headers: { Authorization: 'Bearer ' + TOKEN},
      payload: JSON.stringify({query: query})
    });
  
    const data = response.getContentText();
    return data;
  }
  
  /**
   * Parses the WCL Data and returns the specified property
   *
   * @param wclData The WCL Data (json)
   * @param property The property to return
   * @return The specified property
   * @customfunction
   */
  function parseProperty(wclData, property) {
    const jsonObject = JSON.parse(wclData);
    //Logger.log(jsonObject.data.characterData.character.zoneRankings[property]);
    return jsonObject.data.characterData.character.zoneRankings[property];
  }
  
  /**
   * Parses the WCL Data and returns the number of kills for the provided encounterID.
   *
   * @param wclData The WCL Data (json)
   * @param encounterID The ID of the encounter per WarcraftLogs.
   * @return Total Encounter Kills
   * @customfunction
   */
  function parseEncounterKills(wclData, encounterID) {
    const jsonObject = JSON.parse(wclData);
    const encounterTotalKills = jsonObject.data.characterData.character.zoneRankings.rankings
      .find(rankings => rankings.encounter.id == encounterID).totalKills;
    return encounterTotalKills;
  }

function getAccessToken() {
    const clientId = '9bffb6d2-d735-48be-95c8-aa66f0808f73';
    const clientSecret = 'zdY4U45WIa3PJF9tDBqVQxCjZ1AonXMgTbX95bWd';
    const url = 'https://www.warcraftlogs.com/oauth/token';
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Utilities.base64Encode(clientId + ':' + clientSecret)
        },
        payload: 'grant_type=client_credentials'
    };

    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    //Logger.log(data.access_token);
    return data.access_token;
}