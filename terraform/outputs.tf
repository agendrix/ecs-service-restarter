output "lambda_function" {
  value = aws_lambda_function.lambda
}

output "sns_topic" {
  value = aws_sns_topic.sns_topic
}
