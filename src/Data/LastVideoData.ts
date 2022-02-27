type LastVideoData = {
    thumbnail: string,
    name: string,
    date: Date,
    link: string,
    totalSources: number,
    totalLinks: number,
    sources: { common_name: string, url: string }[]
}

export default LastVideoData