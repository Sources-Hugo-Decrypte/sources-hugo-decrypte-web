import { Handler } from '@netlify/functions'
import HomeData from '../../../src/Data/HomeData'
import OverviewData from '../../../src/Data/OverviewData'
import Top10Data from '../../../src/Data/Top10Data'
const { Client } = require('pg');

export const handler: Handler = async (event, context) => {

  const conString = process.env.HDS_DATABASE_CON
  const client = new Client({ connectionString: conString })

  let overviewData: OverviewData = {
    totalLinks: 0,
    totalSources: 0,
    totalVideos: 0
  }

  let top10Data: Top10Data = {
    labels: new Array<string>(),
    totalLinks: new Array<number>(),
    percentages: new Array<number>()
  }

  await client.connect()

  const totalVideosRes = await client.query('SELECT COUNT(*) FROM video_table;')
  const totalLinksRes = await client.query('SELECT COUNT(*) FROM url_table WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=url_short OR blacklist_url=url_full);')
  const totalSourcesRes = await client.query('SELECT COUNT(*) FROM register_table WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=register_url_short);')
  const top10Res = await client.query('SELECT register_common_name AS "label", COUNT(*) AS "number_urls" FROM register_table INNER JOIN url_table ON register_url_short=url_short INNER JOIN video_table ON url_video_id=video_id WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=url_short OR blacklist_url=url_full) GROUP BY register_common_name ORDER BY number_urls DESC LIMIT 10;')
  
  overviewData.totalVideos = totalVideosRes.rows[0].count
  overviewData.totalLinks = totalLinksRes.rows[0].count
  overviewData.totalSources = totalSourcesRes.rows[0].count

  top10Res.rows.forEach(row => {
    top10Data.labels.push(row.label)
    top10Data.totalLinks.push(Number(row.number_urls))
    top10Data.percentages.push(Number((row.number_urls / overviewData.totalLinks * 100).toFixed(2)))
  });

  await client.end()

  const homeData: HomeData = {
    overview: overviewData,
    top10: top10Data
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(homeData)
  }
}
