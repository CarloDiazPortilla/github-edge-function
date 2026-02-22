import type { HandlerEvent, Context } from "@netlify/functions"

export const handler = async (event: HandlerEvent, context: Context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hola mundo!!" }),
    headers: {
      "Content-Type": "application/json"
    }
  }
}
