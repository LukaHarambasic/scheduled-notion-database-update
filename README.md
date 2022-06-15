# Update notion tasks 

> This repo is still in progress! But it works :)

## Goal

Have a simple function that updates the status of tasks in a Notion database on defined conditions. This can easily be adapted for other automations.

## Use case

We are talking about a project management database that is used in a Scrum set up. For the sake of this script it is only relevant that a task has a status (Single select: Backlog > Open > In Progress > Blocked > Done) and a Sprint (Relation). If a task gets a sprint assigned the status should be changed from `Backlog` to `Open`. 

## Prequesites

Get your `NOTION_KEY` and the `NOTION_DATABASE_ID`. You can read more about it [here](). Don't forget to share your database with your integration otherwise you won't get anything. If you have relations you want to access you also grant your integration access to them.

## Deployment

The Node.js function can be easily deployed at [Pipedream](https://pipedream.com/   ). Therefore, a trigger has to be defined, I decided to let this function run every 30 minutes. Also don't forget to add the environment variables to your [PipeDream account](https://pipedream.com/docs/environment-variables/).

## Potential problems

The job runs every 30min and checks the edited tasks in the last 60min. If the task isn't executed twice in a consequent order some tasks which should be updated might be skipped. This can be mitigated by adapting the filter condition, e.g. check the tasks that got changed during the last day.

## Next steps

- requirement / import
- deploy via CLI or link to github like Netlify (if possible) 
- typescript
- build set up
