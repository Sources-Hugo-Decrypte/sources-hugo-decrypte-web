import { Handler } from '@netlify/functions'
import Top10Data from '../../../src/Data/Top10Data'
const postgres = require('postgres');

export const handler: Handler = async (event, context) => {

  const sql = postgres(process.env.HDS_DATABASE_CON, {max: 1, idle_timeout: 2})

  const top10Data: Top10Data = {
      labels: new Array<string>(),
      totalLinks: new Array<number>(),
      percentages: new Array<number>()
    }

  const top10Res = await sql`SELECT * FROM
                            (SELECT COUNT(*) AS "total_links"
                            FROM url_table
                            WHERE NOT EXISTS (SELECT *
                                        FROM blacklist_table
                                        WHERE blacklist_url=url_short
                                        OR blacklist_url=url_full)) table_count
                            CROSS JOIN
                            (SELECT register_common_name AS "label", COUNT(*) AS "number_urls"
                            FROM register_table
                            INNER JOIN url_table ON register_url_short=url_short
                            INNER JOIN video_table ON url_video_id=video_id
                            WHERE NOT EXISTS (SELECT * FROM blacklist_table
                                                WHERE blacklist_url=url_short
                                                OR blacklist_url=url_full)
                            GROUP BY register_common_name
                            ORDER BY number_urls
                            DESC LIMIT 10) table_data;`
  
  sql.end()

  top10Res.forEach(row => {
    top10Data.labels.push(row.label)
    top10Data.totalLinks.push(Number(row.number_urls))
    top10Data.percentages.push(Number((row.number_urls / row.total_links * 100).toFixed(2)))
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(top10Data)
  }
}
