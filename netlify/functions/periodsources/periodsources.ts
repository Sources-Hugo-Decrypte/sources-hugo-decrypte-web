import { Handler } from '@netlify/functions'
import PeriodSourcesData from "../../../src/Data/PeriodSourcesData"
const postgres = require('postgres');

export const handler: Handler = async (event, context) => {

    const sql = postgres(process.env.HDS_DATABASE_CON, {max: 1, idle_timeout: 2})
  
    const periodData: PeriodSourcesData = {
        nbSources: {
            date: new Array<string>(),
            totalSources: new Array<number>()
        },
        nbLinks: {
          date: new Array<string>(),
          totalLinks: new Array<number>()
      }
    }
    
    const periodNbSourcesRes = await sql`SELECT * FROM
                                        (WITH non_empty_source_table AS
                                        (SELECT video_id, video_date AS "date", COUNT(DISTINCT register_common_name) AS "number_sources"
                                        FROM video_table
                                        INNER JOIN url_table ON video_id=url_video_id
                                        INNER JOIN register_table ON register_url_short=url_short
                                        WHERE NOT EXISTS (SELECT * FROM blacklist_table
                                                  WHERE blacklist_url=url_short
                                                  OR blacklist_url=url_full)
                                        AND video_date BETWEEN '02/02/2022' AND '04/03/2022 23:59:59'
                                        GROUP BY video_id, video_date)
                                        SELECT video_id, video_date AS "date", 0 AS "number_sources"
                                        FROM video_table
                                        WHERE NOT EXISTS (SELECT * FROM non_empty_source_table
                                                  WHERE video_table.video_id=non_empty_source_table.video_id)
                                        AND video_date BETWEEN '02/02/2022' AND '04/03/2022 23:59:59'

                                        UNION

                                        SELECT video_id, video_date AS "date", COUNT(DISTINCT register_common_name) AS "number_sources"
                                        FROM video_table
                                        INNER JOIN url_table ON video_id=url_video_id
                                        INNER JOIN register_table ON register_url_short=url_short
                                        WHERE NOT EXISTS (SELECT * FROM blacklist_table
                                                  WHERE blacklist_url=url_short
                                                  OR blacklist_url=url_full)
                                        AND video_date BETWEEN '02/02/2022' AND '04/03/2022 23:59:59'
                                        GROUP BY video_id, video_date) table_total
                                        ORDER BY date;`
    const periodNbLinksRes = await sql`SELECT * FROM
                                      (WITH non_empty_source_table AS (SELECT video_id, video_date AS "date", COUNT(*) AS "number_urls"
                                      FROM video_table
                                      INNER JOIN url_table ON video_id=url_video_id
                                      WHERE NOT EXISTS (SELECT * FROM blacklist_table
                                                WHERE blacklist_url=url_short
                                                OR blacklist_url=url_full)
                                      AND video_date BETWEEN '02/02/2022' AND '04/03/2022 23:59:59'
                                      GROUP BY video_id, video_date)
                                      SELECT video_id, video_date AS "date", 0 AS "number_urls"
                                      FROM video_table
                                      WHERE NOT EXISTS (SELECT * FROM non_empty_source_table
                                                WHERE video_table.video_id=non_empty_source_table.video_id)
                                      AND video_date BETWEEN '02/02/2022' AND '04/03/2022 23:59:59'
                                      
                                      UNION
                                      
                                      SELECT video_id, video_date AS "date", COUNT(*) AS "number_urls"
                                      FROM video_table
                                      INNER JOIN url_table ON video_id=url_video_id
                                      WHERE NOT EXISTS (SELECT * FROM blacklist_table
                                                WHERE blacklist_url=url_short
                                                OR blacklist_url=url_full)
                                      AND video_date BETWEEN '02/02/2022' AND '04/03/2022 23:59:59'
                                      GROUP BY video_id, video_date) table_total
                                      
                                      ORDER BY date;`
    
    sql.end()
  
    periodNbSourcesRes.forEach(row => {
      periodData.nbSources.date.push(new Date(row.date).toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'}))
      periodData.nbSources.totalSources.push(Number(row.number_sources))
    });

    periodNbLinksRes.forEach(row => {
      periodData.nbLinks.date.push(new Date(row.date).toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'}))
      periodData.nbLinks.totalLinks.push(Number(row.number_urls))
    });
  
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(periodData)
    }
}
