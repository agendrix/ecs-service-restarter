import { SNSHandler, SNSEvent } from "aws-lambda";
import { ECSClient, UpdateServiceCommand, UpdateServiceCommandInput, } from "@aws-sdk/client-ecs";
import { fetchAlarmPayload, fetchPrimaryDeployment, formatRollRestartCommand, validateIsInAlarmState } from "./utils";

const handler: SNSHandler = async (event: SNSEvent) => {
  try {
    const alarmPayload = fetchAlarmPayload(event);
    validateIsInAlarmState(alarmPayload);
    const client = new ECSClient({ region: process.env.REGION });
    const input: UpdateServiceCommandInput = formatRollRestartCommand(alarmPayload);
    console.log(`Roll restart request received for service: ${input.service} in cluster: ${input.cluster}`);
    const command = new UpdateServiceCommand(input);
    const { service } = await client.send(command);
    const deployment = fetchPrimaryDeployment(service);
    console.log(`Roll restart was successfully started for service: ${input.service} in cluster: ${input.cluster} with task definition: ${deployment?.taskDefinition}. Deployment id: ${deployment?.id}`);
  } catch(error)  {
    console.log(error);
  }
};

exports.handler = handler;
