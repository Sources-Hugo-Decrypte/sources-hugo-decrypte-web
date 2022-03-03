import { Handler } from '@netlify/functions'
import LastVideoData from '../../../src/Data/LastVideoData'
const postgres = require('postgres');

export const handler: Handler = async (event, context) => {

  const sql = postgres(process.env.HDS_DATABASE_CON, { max: 1, idle_timeout: 2 })

  const lastVideoData: LastVideoData = {
    thumbnail: "",
    name: "",
    date: new Date(),
    link: "",
    totalSources: 0,
    totalLinks: 0,
    sources: new Array<{ common_name: string, url: string }>()
  }

  const hrstart = process.hrtime()
  const lastVideoDataRes = await sql`SELECT * FROM
                                    (SELECT video_id, video_name, video_date, video_img FROM video_table
                                    WHERE video_name IS NOT NULL
                                    ORDER BY video_date DESC
                                    LIMIT 1) table_generic_data
                                    CROSS JOIN
                                    (WITH id_table as (
                                        SELECT video_id FROM video_table
                                        WHERE video_name IS NOT NULL
                                        ORDER BY video_date DESC
                                        LIMIT 1
                                    )
                                    SELECT register_common_name, url_full FROM register_table
                                    INNER JOIN url_table ON register_url_short=url_short
                                    WHERE url_video_id = (SELECT video_id FROM id_table)
                                    AND NOT EXISTS (SELECT *
                                                FROM blacklist_table
                                                WHERE blacklist_url=url_short
                                                OR blacklist_url=url_full)
                                    ORDER BY register_common_name) table_sources_data
                                    CROSS JOIN
                                    (WITH id_table as (
                                        SELECT video_id FROM video_table
                                        WHERE video_name IS NOT NULL
                                        ORDER BY video_date DESC
                                        LIMIT 1
                                    )
                                    SELECT COUNT(DISTINCT register_common_name) AS "number_sources" FROM register_table
                                    INNER JOIN url_table ON register_url_short=url_short
                                    WHERE url_video_id = (SELECT video_id FROM id_table)
                                    AND NOT EXISTS (SELECT *
                                                FROM blacklist_table
                                                WHERE blacklist_url=url_short
                                                OR blacklist_url=url_full)
                                    ) table_nb_sources;`

  sql.end()

  const hrend = process.hrtime(hrstart)
  console.info('Execution time for Last Video (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

  lastVideoData.thumbnail = lastVideoDataRes[0].video_img
  lastVideoData.name = lastVideoDataRes[0].video_name.replace(/\\u0027/g, "'")
  lastVideoData.date = lastVideoDataRes[0].video_date
  lastVideoData.link = "https://www.youtube.com/watch?v=" + lastVideoDataRes[0].video_id
  lastVideoData.totalSources = lastVideoDataRes[0].number_sources
  lastVideoData.totalLinks = lastVideoDataRes.length

  lastVideoDataRes.forEach(row => {
    lastVideoData.sources.push({ common_name: row.register_common_name, url: row.url_full })
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lastVideoData)
  }
}
