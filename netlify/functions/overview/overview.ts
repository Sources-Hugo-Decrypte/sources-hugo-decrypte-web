import { Handler } from '@netlify/functions'
import OverviewData from '../../../src/Data/OverviewData'
const postgres = require('postgres');

export const handler: Handler = async (event, context) => {

  const sql = postgres(process.env.HDS_DATABASE_CON, { max: 1, idle_timeout: 2 })

  const overviewData: OverviewData = {
    totalLinks: 0,
    totalSources: 0,
    totalVideos: 0
  }

  const hrstart = process.hrtime()
  const [overviewDataRes] = await sql`SELECT total_videos, total_links, total_sources
                                  FROM (SELECT COUNT(*) as total_videos FROM video_table) total_videos
                                  CROSS JOIN (SELECT COUNT(*) as total_links FROM url_table WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=url_short OR blacklist_url=url_full)) total_links
                                  CROSS JOIN (SELECT COUNT(DISTINCT register_common_name) as total_sources FROM register_table INNER JOIN url_table ON register_url_short=url_short WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=url_short OR blacklist_url=url_full)) total_sources`

  sql.end()
  const hrend = process.hrtime(hrstart)
  console.info('Execution time for Overview (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

  overviewData.totalVideos = overviewDataRes.total_videos
  overviewData.totalLinks = overviewDataRes.total_links
  overviewData.totalSources = overviewDataRes.total_sources
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(overviewData)
  }
}
