import { Handler } from '@netlify/functions'
import HomeData from '../../../src/Data/HomeData'
const postgres = require('postgres');

export const handler: Handler = async (event, context) => {

  const sql = postgres(process.env.HDS_DATABASE_CON, {max: 1, idle_timeout: 2})

  const homeData: HomeData = {
    overview: {
      totalLinks: 0,
      totalSources: 0,
      totalVideos: 0
    },
    top10: {
      labels: new Array<string>(),
      totalLinks: new Array<number>(),
      percentages: new Array<number>()
    }
  }

  const [overviewDataRes] = await sql`SELECT total_videos, total_links, total_sources
                                  FROM (SELECT COUNT(*) as total_videos FROM video_table) total_videos
                                  CROSS JOIN (SELECT COUNT(*) as total_links FROM url_table WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=url_short OR blacklist_url=url_full)) total_links
                                  CROSS JOIN (SELECT COUNT(*) as total_sources FROM register_table WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=register_url_short)) total_sources`
  const top10Res = await sql`SELECT register_common_name AS "label", COUNT(*) AS "number_urls" FROM register_table INNER JOIN url_table ON register_url_short=url_short INNER JOIN video_table ON url_video_id=video_id WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=url_short OR blacklist_url=url_full) GROUP BY register_common_name ORDER BY number_urls DESC LIMIT 10;`
  
  sql.end()

  homeData.overview.totalVideos = overviewDataRes.total_videos
  homeData.overview.totalLinks = overviewDataRes.total_links
  homeData.overview.totalSources = overviewDataRes.total_sources

  top10Res.forEach(row => {
    homeData.top10.labels.push(row.label)
    homeData.top10.totalLinks.push(Number(row.number_urls))
    homeData.top10.percentages.push(Number((row.number_urls / homeData.overview.totalLinks * 100).toFixed(2)))
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(homeData)
  }
}
