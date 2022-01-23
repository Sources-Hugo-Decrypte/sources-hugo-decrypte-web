import { Handler } from '@netlify/functions'
import HomeData from '../../../src/Data/HomeData'
import OverviewData from '../../../src/Data/OverviewData'
import Top10Data from '../../../src/Data/Top10Data'

export const handler: Handler = async (event, context) => {

  // For now, Home data is written in hard copy
  const overviewData: OverviewData = {
    totalVideos: 875,
    totalSources: 643,
    totalLinks: 11834
  }

  const Top10Data: Top10Data = {
    labels: ['lemonde.fr', 'francetvinfo.fr', '20minutes.fr', 'leparisien.fr', 'lefigaro.fr', 'huffingtonpost.fr', 'bfmtv.com', 'ouest-france.fr', 'lci.fr', 'courrierinternational.com'],
    totalLinks: [895, 732, 330, 314, 306, 260, 229, 229, 203, 178],
    percentages: [7.56, 6.19, 2.79, 2.65, 2.59, 2.19, 1.94, 1.94, 1.72, 1.5]
  }

  const homeData: HomeData = {
    overview: overviewData,
    top10: Top10Data
  }

  return {
    statusCode: 200,
    body: JSON.stringify(homeData),
  }
}
