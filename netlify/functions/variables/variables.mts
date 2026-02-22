import type { HandlerEvent, Context } from "@netlify/functions"

export const handler = async (event: HandlerEvent, context: Context) => {
  const myImportantVariables = process.env.MY_SECRET_VARIABLE;

  if (!myImportantVariables) throw new Error("Missing MY_SECRET_VARIABLE");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: myImportantVariables })
  }
}
