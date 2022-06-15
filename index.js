const { Client } = require("@notionhq/client")
const dotenv = require("dotenv")

dotenv.config()

const DATABASE_ID = process.env.NOTION_DATABASE_ID
const PROPERTIES = {
    status: "Status",
    sprint: "Sprint",
}

const STATUS = {
    backlog: "Backlog"
}

const notion = new Client({ auth: process.env.NOTION_KEY })

async function getTasksToUpdate() {
    const pages = []
    let cursor = undefined

    const ONE_HOUR = 60 * 60 * 1000
    const oneHourAgo = new Date(new Date().getTime() - ONE_HOUR)

    while (true) {
        const { results, next_cursor } = await notion.databases.query({
            database_id: DATABASE_ID,
            start_cursor: cursor,
            filter: {
                timestamp: "last_edited_time",
                last_edited_time: {
                    after: oneHourAgo
                }
            }
        })
        pages.push(...results)
        if (!next_cursor) {
            break
        }
        cursor = next_cursor
    }
    console.log(`${pages.length} tasks got edited in the last 60 minutes.`)
    const tasks = pages.map(page => {
        const statusProperty = page.properties[PROPERTIES.status]
        const status = statusProperty && statusProperty.select ? statusProperty.select.name : null
        const hasStatusBacklog = status === STATUS.backlog
        const hasSprint = page.properties[PROPERTIES.sprint].relation.length > 0
        return {
            pageId: page.id,
            hasStatusBacklog,
            hasSprint
        }
    })
    return tasks.filter(task => task.hasSprint && task.hasStatusBacklog)
}

async function updateTaskStatus(tasks) {
    for (const task of tasks) {
        await notion.pages.update({
            page_id: task.pageId,
            properties: {
                "Status": {
                    "select": {
                        "name": "Open"
                    }
                },
            },
        })
    }
}

async function main() {
    const tasks = await getTasksToUpdate()
    await updateTaskStatus(tasks)
    console.log(`${tasks.length} tasks got updated.`)
}

main().then(r => console.log("Finished"))
