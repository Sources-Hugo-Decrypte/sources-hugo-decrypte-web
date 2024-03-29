import { Handler } from '@netlify/functions'
import PeriodSourcesData from "../../../src/Data/PeriodSourcesData"
const postgres = require('postgres');

export const handler: Handler = async (event, context) => {

    const sql = postgres(process.env.REACT_APP_HDS_DATABASE_CON, {max: 1, idle_timeout: 2})
  
    const periodData: PeriodSourcesData = {
      nbSources: {
          date: new Array<string>(),
          totalSources: new Array<number>()
      }
    }

    const todayDate = new Date();
    const oneMonthAgoDate = new Date();
    oneMonthAgoDate.setDate(todayDate.getDate() - 30);
    const startDate = "'"+oneMonthAgoDate.toLocaleDateString('en-EN')+"'";
    const endDate = "'"+todayDate.toLocaleDateString('en-EN')+" 23:59:59'";
    
    const periodNbSourcesRes = await sql`SELECT * FROM
                                        (WITH non_empty_source_table AS
                                        (SELECT video_id, video_date AS "date", COUNT(DISTINCT register_common_name) AS "number_sources"
                                        FROM video_table
                                        INNER JOIN url_table ON video_id=url_video_id
                                        INNER JOIN register_table ON register_url_short=url_short
                                        WHERE NOT EXISTS (SELECT * FROM blacklist_table
                                                  WHERE blacklist_url=url_short
                                                  OR blacklist_url=url_full)
                                        AND video_date BETWEEN ${startDate} AND ${endDate}
                                        GROUP BY video_id, video_date)
                                        SELECT video_id, video_date AS "date", 0 AS "number_sources"
                                        FROM video_table
                                        WHERE NOT EXISTS (SELECT * FROM non_empty_source_table
                                                  WHERE video_table.video_id=non_empty_source_table.video_id)
                                        AND video_date BETWEEN ${startDate} AND ${endDate}

                                        UNION

                                        SELECT video_id, video_date AS "date", COUNT(DISTINCT register_common_name) AS "number_sources"
                                        FROM video_table
                                        INNER JOIN url_table ON video_id=url_video_id
                                        INNER JOIN register_table ON register_url_short=url_short
                                        WHERE NOT EXISTS (SELECT * FROM blacklist_table
                                                  WHERE blacklist_url=url_short
                                                  OR blacklist_url=url_full)
                                        AND video_date BETWEEN ${startDate} AND ${endDate}
                                        GROUP BY video_id, video_date) table_total
                                        ORDER BY date;`
    
    sql.end()
  
    periodNbSourcesRes.forEach(row => {
      periodData.nbSources.date.push(new Date(row.date).toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'}))
      periodData.nbSources.totalSources.push(Number(row.number_sources))
    });
  
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(periodData)
    }
}
