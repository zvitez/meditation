// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Client, APIErrorCode, LogLevel } from "@notionhq/client"


const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === 'POST') {
    const todoID = req.body.todoID;

    if (todoID != undefined) {
      try {
        const response = await notion.pages.update({
          page_id: todoID,
          properties: {
            'Done': {
              checkbox: true,
            },
          },
        });
      } catch (error) {
          res.status(500).json({ message: error })          
      }
      res.status(201).json({ message: 'Done!' })
    } else {
      res.status(500).json({ message: 'Todo ID is undefined.' })
    }
  } else {
    res.status(200).json({ message: 'Hi there!' })
  }  
}
