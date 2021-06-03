export interface CloudWatchAlarm {
  NewStateValue: string;
  Trigger: CloudWatchAlarmTrigger
}

interface CloudWatchAlarmTrigger {
  Dimensions: Array<MetricDimension>
}

interface MetricDimension {
  value: string
  name: EcsServiceMetricDimensions
}

export const enum EcsServiceMetricDimensions {
  CLUSTER_NAME = "ClusterName",
  SERVICE_NAME = "ServiceName"
}

export const enum DeploymentStatus {
  ACTIVE = "ACTIVE",
  PRIMARY = "PRIMARY"
}

export const enum CloudWatchAlarmState {
  OK = "OK",
  ALARM = "ALARM",
  INSUFFICIENT_DATA = "INSUFFICIENT_DATA"
}
