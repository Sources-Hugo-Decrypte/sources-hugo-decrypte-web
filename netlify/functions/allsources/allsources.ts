import { Handler } from '@netlify/functions'
import AllSourcesData from '../../../src/Data/AllSourcesData'
import AllSourcesSingleData from '../../../src/Data/AllSourcesSingleData'
const postgres = require('postgres');

export const handler: Handler = async (event, context) => {

  const sql = postgres(process.env.HDS_DATABASE_CON, {max: 1, idle_timeout: 2})
  
  const allSourcesData: AllSourcesData = new Array<AllSourcesSingleData>();

  const allSourcesDataRes = await sql`SELECT * FROM
                                    (SELECT COUNT(*) AS "total_links"
                                    FROM url_table
                                    WHERE NOT EXISTS (SELECT *
                                                FROM blacklist_table
                                                WHERE blacklist_url=url_short
                                                OR blacklist_url=url_full)) table_count
                                    CROSS JOIN
                                    (SELECT register_common_name AS "label", COUNT(*) AS "number_urls", MAX(video_date) AS "most_recent"
                                    FROM register_table
                                    INNER JOIN url_table ON register_url_short=url_short
                                    INNER JOIN video_table ON url_video_id=video_id
                                    WHERE NOT EXISTS (SELECT *
                                                FROM blacklist_table
                                                WHERE blacklist_url=url_short
                                                OR blacklist_url=url_full)
                                    GROUP BY register_common_name
                                    ORDER BY number_urls DESC, most_recent DESC) table_data`
  
  sql.end()

  allSourcesDataRes.forEach((row, index) => {
    allSourcesData.push(
      {
        grade: index+1,
        name: row.label,
        totalLinks: Number(row.number_urls),
        percentage: Number((row.number_urls / row.total_links * 100).toFixed(2)),
        lastDate: row.most_recent
      }
    )
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(allSourcesData)
  }
}
