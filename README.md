# ECS service restarter

_An AWS Lambda for triggering an ECS service roll restart with a CloudWatch metric alarm_

![Release](https://github.com/agendrix/ecs-service-restarter/workflows/Release/badge.svg) ![Tests](https://github.com/agendrix/ecs-service-restarter/workflows/Tests/badge.svg?branch=main)

## Prerequisites

- The CloudWatch metric alarm that triggers the Lamdba function must have the following dimensions:
  - ServiceName: The name of the ECS service you want to roll restart
  - ClusterName: The name of the ECS cluster in which the service resides

## How to use with Terraform

Add the module to your [Terraform](https://www.terraform.io/) project:

```terraform
module "ecs_service_restarter" {
  source                         = "github.com/agendrix/ecs-service-restarter.git//terraform?ref=v0.1.0"
  region                         = var.region
  account_id                     = var.account_id
  sns_topic_to_notify_on_failure = aws_sns_topic.ops.arn
}
```

You can now call the Lambda function from a CloudWatch Alarm by specifying the ECS service restarter SNS topic arn in the `alarm_actions`

```terraform
resource "aws_cloudwatch_metric_alarm" "maximum_memory_utilization" {
  alarm_name          = "Maximum Memory Utilization"
  namespace           = "AWS/ECS"
  metric_name         = "MemoryUtilization"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  statistic           = "Maximum"
  period              = 60
  threshold           = 75
  datapoints_to_alarm = 1
  evaluation_periods  = 1
  treat_missing_data  = "notBreaching"
  unit                = "Percent"
  alarm_actions       = [module.ecs_service_restarter.sns_topic.arn]
  dimensions = {
    ClusterName = aws_ecs_cluster.cluster.name
    ServiceName = aws_ecs_service.service.name
  }
}
```
