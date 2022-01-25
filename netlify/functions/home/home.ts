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
  
  // For now, TOP10 is written in hard copy
  let top10Data: Top10Data = {
    labels: ['lemonde.fr', 'francetvinfo.fr', '20minutes.fr', 'leparisien.fr', 'lefigaro.fr', 'huffingtonpost.fr', 'bfmtv.com', 'ouest-france.fr', 'lci.fr', 'courrierinternational.com'],
    totalLinks: [895, 732, 330, 314, 306, 260, 229, 229, 203, 178],
    percentages: [7.56, 6.19, 2.79, 2.65, 2.59, 2.19, 1.94, 1.94, 1.72, 1.5]
  }

  await client.connect()

  const totalVideosRes = await client.query('SELECT COUNT(*) FROM video_table;')
  const totalLinksRes = await client.query('SELECT COUNT(*) FROM url_table WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=url_short OR blacklist_url=url_full);')
  const totalSourcesRes = await client.query('SELECT COUNT(*) FROM register_table WHERE NOT EXISTS (SELECT * FROM blacklist_table WHERE blacklist_url=register_url_short);')
  
  overviewData.totalVideos = totalVideosRes.rows[0].count
  overviewData.totalLinks = totalLinksRes.rows[0].count
  overviewData.totalSources = totalSourcesRes.rows[0].count

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
