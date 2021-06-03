export const PAYLOAD = {
  Records: [
    {
      EventSource: "aws:sns",
      EventVersion: "1.0",
      EventSubscriptionArn: "arn:aws:sns:region:12345:ecs-service-restarter:id",
      Sns: {
        Message: "{\"AlarmName\":\"Alarm\",\"AlarmDescription\":null,\"AWSAccountId\":\"12345\",\"NewStateValue\":\"ALARM\",\"NewStateReason\":\"Threshold Crossed: 1 out of the last 1 datapoints [34.5458984375 (02/06/21 19:57:00)] was greater than or equal to the threshold (25.0) (minimum 1 datapoint for OK -> ALARM transition).\",\"StateChangeTime\":\"2021-06-02T19:59:40.636+0000\",\"Region\":\"Canada (Central)\",\"AlarmArn\":\"arn:aws:cloudwatch:region:12345:alarm:Alarm\",\"OldStateValue\":\"OK\",\"Trigger\":{\"MetricName\":\"Metric\",\"Namespace\":\"AWS\",\"StatisticType\":\"Statistic\",\"Statistic\":\"MAXIMUM\",\"Unit\":\"Percent\",\"Dimensions\":[{\"value\":\"service\",\"name\":\"ServiceName\"},{\"value\":\"name\",\"name\":\"ClusterName\"}],\"Period\":60,\"EvaluationPeriods\":1,\"ComparisonOperator\":\"GreaterThanOrEqualToThreshold\",\"Threshold\":25.0,\"TreatMissingData\":\"- TreatMissingData:                    notBreaching\",\"EvaluateLowSampleCountPercentile\":\"\"}}",
      }
    }
  ]
}

export const FORMATTED_PAYLOAD = {
  AlarmName: "Alarm ",
  AlarmDescription: null,
  AWSAccountId: "12345",
  NewStateValue: "ALARM",
  NewStateReason: "Threshold Crossed: 1 out of the last 1 datapoints [34.5458984375 (02/06/21 19:57:00)] was greater than or equal to the threshold (25.0) (minimum 1 datapoint for OK -> ALARM transition).",
  StateChangeTime: "2021-06-02T19:59:40.636+0000",
  Region: "Canada (Central)",
  AlarmArn: "arn:aws:cloudwatch:ca-central-1:12345:alarm:Alarm ",
  OldStateValue: "OK",
  Trigger: {
    MetricName: "MemoryUtilization",
    Namespace: "AWS/ECS",
    StatisticType: "Statistic",
    Statistic: "MAXIMUM",
    Unit: "Percent",
    Dimensions: [
      {
        value: "service",
        name: "ServiceName"
      },
      {
        value: "cluster",
        name: "ClusterName"
      }
    ],
    Period: 60,
    EvaluationPeriods: 1,
    ComparisonOperator: "GreaterThanOrEqualToThreshold",
    Threshold: 25,
    TreatMissingData: "- TreatMissingData:                    notBreaching",
    EvaluateLowSampleCountPercentile: ""
  }
}