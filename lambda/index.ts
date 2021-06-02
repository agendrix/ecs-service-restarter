import { SNSHandler } from "aws-lambda";
import { ECSClient, UpdateServiceCommand, UpdateServiceCommandInput, } from "@aws-sdk/client-ecs";
import { SNSEvent } from "aws-lambda"

const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    // TODO: Delete
    console.log(JSON.stringify(event));

    const alarmPayload = fetchAlarmPayload(event);
    if (alarmPayload.NewStateValue !== "ALARM") return;

    const client = new ECSClient({ region: process.env.REGION });
    const input: UpdateServiceCommandInput = formatCommandInput(event);
    console.log(`Roll restart request received for service: ${input.service} in cluster: ${input.cluster}`);
    const command = new UpdateServiceCommand(input);
    await client.send(command);
    console.log(`Roll restart was successfully started for service: ${input.service} in cluster: ${input.cluster}`)
  } catch(error)  {
    console.log(error);
  }
};

const fetchAlarmPayload = (event: SNSEvent) => {
  const message = event.Records.shift()?.Sns.Message;
  if (message) {
    return JSON.parse(message);
  } else {
    throw new Error(`The SNS event received does not comply with the requirements. Event: ${JSON.stringify(event)}`);
  }
}

const formatCommandInput = (payload): UpdateServiceCommandInput => {
  const metricDimensions = payload.Trigger.Dimensions;
  const cluster: string = metricDimensions.find(d => d.Name === "ClusterName").Value;
  const service: string = metricDimensions.find(d => d.Name === "ServiceName").Value;
  if (cluster && service) {
    return { cluster, service, forceNewDeployment: true };
  }

  throw new Error(`The SNS event received does not comply with the requirements. Event: ${JSON.stringify(event)}`);
}

exports.handler = handler;

export const __test__ = {
  handler,
  formatCommandInput
};