variable "sns_topic_to_notify_on_failure" {
  description = "Arn of the sns topic to notify on lambda invocation failure."
  type        = string
  default     = null
}

variable "region" {
  description = "Region in which the lambda will be deployed."
  type        = string
}

variable "account_id" {
  description = "AWS account ID"
}
