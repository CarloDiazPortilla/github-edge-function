import type { HandlerEvent, Context } from "@netlify/functions"

const notify = async (message: string) => {
  const body = {
    content: message,
  }

  const resp = await fetch(process.env.DISCORD_WEBHOOK_URL ?? "", {
    method: "POST",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(body)
  })

  if (!resp.ok) {
    console.log("Error sending message to discord")
    return false;
  }

  return true;
}

const onStar = (payload: any) => {
  const { action, repository, sender } = payload;
  return `User ${sender.login} ${action} star on ${repository.full_name}`
}

const onIssue = (payload: any) => {
  const { action, issue, repository, sender } = payload;

  if (action === "opened") {
    return `Issue was opened with name ${issue.title} by ${sender.login} in ${repository.full_name} repository`;
  }

  if (action === "closed") {
    return `An issue with name ${issue.title} was closed by ${issue.user.login} in ${repository.full_name} repository`;
  }

  if (action === "reopened") {
    return `An issue with name ${issue.title} was reopened by ${issue.user.login} in ${repository.full_name} repository`;
  }

  return `Unhandled issue action (${action}) was performed by ${sender.login} in ${repository.full_name} repository`
}

export const handler = async (event: HandlerEvent, context: Context) => {

  const githubEvent = event.headers["x-github-event"] ?? "unknown";
  const payload = JSON.parse(event.body ?? "{}");

  console.log(payload);
  console.log(githubEvent);

  let message: string | null = null;

  switch (githubEvent) {
    case "star":
      message = onStar(payload);
      break;

    case "issues":
      message = onIssue(payload);
      break;

    default:
      console.log(`Unknown event ${githubEvent}`);
      message = `Unknown event ${githubEvent}`;
  }

  await notify(message);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: "done" })
  }
}

