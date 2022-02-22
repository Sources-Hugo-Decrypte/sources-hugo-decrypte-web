import { Handler } from '@netlify/functions'
import PeriodData from "../../../src/Data/PeriodData"
const postgres = require('postgres');

export const handler: Handler = async (event, context) => {

    const sql = postgres(process.env.HDS_DATABASE_CON, {max: 1, idle_timeout: 2})
  
    const periodData: PeriodData = {
        nbSources: {
            date: new Array<string>(),
            totalSources: new Array<number>()
        },
        top10: {
            labels: new Array<string>(),
            totalLinks: new Array<number>(),
            percentages: new Array<number>()
        },
    }
  
    const periodTop10Res = await sql`SELECT register_common_name AS "label", COUNT(*) AS "number_urls" FROM register_table INNER JOIN url_table ON register_url_short=url_short INNER JOIN video_table ON url_video_id=video_id WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=url_short OR blacklist_url=url_full) AND video_date BETWEEN '2022-01-01' AND '2022-02-20 23:59:59' GROUP BY register_common_name ORDER BY number_urls DESC LIMIT 10;`
    const periodNbSourcesRes = await sql`SELECT video_id, video_date AS "date", COUNT(*) AS "number_urls" FROM video_table INNER JOIN url_table ON video_id=url_video_id WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=url_short OR blacklist_url=url_full) AND video_date BETWEEN '2022-01-01' AND '2022-02-20 23:59:59' GROUP BY video_id, video_date ORDER BY video_date;`
    
    sql.end()
  
    periodTop10Res.forEach(row => {
      periodData.top10.labels.push(row.label)
      periodData.top10.totalLinks.push(Number(row.number_urls))
    });
  
    periodNbSourcesRes.forEach(row => {
      periodData.nbSources.date.push(new Date(row.date).toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'}))
      periodData.nbSources.totalSources.push(Number(row.number_urls))
    });
  
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(periodData)
    }
}
