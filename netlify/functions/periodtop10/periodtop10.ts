import { Handler } from '@netlify/functions'
import Top10Data from "../../../src/Data/Top10Data"
const postgres = require('postgres');

export const handler: Handler = async (event, context) => {

    const sql = postgres(process.env.REACT_APP_HDS_DATABASE_CON, {max: 1, idle_timeout: 2})
  
    const periodTop10Data: Top10Data = {
        labels: new Array<string>(),
        totalLinks: new Array<number>(),
        percentages: new Array<number>()
    }

    const todayDate = new Date();
    const oneMonthAgoDate = new Date();
    oneMonthAgoDate.setDate(todayDate.getDate() - 30);
    const startDate = "'"+oneMonthAgoDate.toLocaleDateString('en-EN')+"'";
    const endDate = "'"+todayDate.toLocaleDateString('en-EN')+" 23:59:59'";
  
    const periodTop10Res = await sql`SELECT register_common_name AS "label", COUNT(*) AS "number_urls"
                                    FROM register_table
                                    INNER JOIN url_table ON register_url_short=url_short
                                    INNER JOIN video_table ON url_video_id=video_id
                                    WHERE NOT EXISTS (SELECT * FROM blacklist_table
                                                      WHERE blacklist_url=url_short
                                                      OR blacklist_url=url_full)
                                    AND video_date BETWEEN ${startDate} AND ${endDate}
                                    GROUP BY register_common_name
                                    ORDER BY number_urls
                                    DESC LIMIT 10;`
    
    sql.end()
  
    periodTop10Res.forEach(row => {
        periodTop10Data.labels.push(row.label)
        periodTop10Data.totalLinks.push(Number(row.number_urls))
    });
  
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(periodTop10Data)
    }
}
