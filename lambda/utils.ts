import { Deployment, Service, UpdateServiceCommandInput } from "@aws-sdk/client-ecs";
import { SNSEvent } from "aws-lambda";
import { CloudWatchAlarm, CloudWatchAlarmState, DeploymentStatus, EcsServiceMetricDimensions } from "./types";

export function fetchAlarmPayload(event: SNSEvent) {
  const message = event.Records[0]?.Sns.Message;
  if (message) {
    return JSON.parse(message);
  } else {
    throw new Error(`The SNS event received does not comply with the requirements. Event: ${JSON.stringify(event)}`);
  }
}

export function formatRollRestartCommand(payload: CloudWatchAlarm): UpdateServiceCommandInput {
  const metricDimensions = payload.Trigger?.Dimensions;
  if (metricDimensions) {
    const cluster: string | undefined = metricDimensions.find(d => d.name === EcsServiceMetricDimensions.CLUSTER_NAME)?.value;
    const service: string | undefined = metricDimensions.find(d => d.name === EcsServiceMetricDimensions.SERVICE_NAME)?.value;
    if (cluster && service) {
      return { cluster, service, forceNewDeployment: true };
    }
  }

  throw new Error(`The SNS event received does not comply with the requirements. Payload: ${JSON.stringify(payload)}`);
}

export function fetchPrimaryDeployment(service: Service | undefined): Deployment | undefined {
  return service?.deployments?.find(d => d.status === DeploymentStatus.PRIMARY);
}

export function validateIsInAlarmState(payload: CloudWatchAlarm)   {
  if (payload.NewStateValue !== CloudWatchAlarmState.ALARM) {
    throw new Error("This lambda function should only be called when a CloudWatch alarm is transitioning to the ALARM state.");
  }
}
