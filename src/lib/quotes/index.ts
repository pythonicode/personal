export type Quote = {
    content: string
    author: string
    source?: string
}

export const quotes: Quote[] = [
    {
        content: "When joining startups I noticed that the pace of development would churn out major amount of technical debt and spaghetti code, I was surprised to find this problem exacerbated and not nullified in larger software companies.",
        author: "Anthony Riley"
    },
    {
        content: "Code is like humor. When you have to explain it, it's bad.",
        author: "Cory House"
    },
    {
        content: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        author: "Martin Fowler"
    },
    {
        content: "Programs must be written for people to read, and only incidentally for machines to execute.",
        author: "Harold Abelson"
    },
    {
        content: "Walking on water and developing software from a specification are easy if both are frozen.",
        author: "Edward V. Berard"
    },
    {
        content: "Software is a great combination between artistry and engineering.",
        author: "Bill Gates"
    },
    {
        content: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci"
    },
]

/**
 * Simple hash function that converts a string to a positive integer
 */
function simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
}

/**
 * Get a quote based on the current time (changes every hour)
 * Uses a hash of the current date and hour to deterministically select a quote
 */
export function getTimeBasedQuote(): Quote {
    const now = new Date()
    const dateHourString = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`
    const hash = simpleHash(dateHourString)
    const index = hash % quotes.length
    return quotes[index]
}