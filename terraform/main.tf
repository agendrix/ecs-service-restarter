locals {
  lambda_zip = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "lambda" {
  function_name    = "ecs-service-restarter"
  filename         = local.lambda_zip
  source_code_hash = filebase64sha256(local.lambda_zip)
  handler          = "index.handler"
  role             = aws_iam_role.lambda_execution_role.arn

  runtime = "nodejs18.x"

  environment {
    variables = {
      REGION = var.region
    }
  }

  dynamic dead_letter_config {
    for_each = var.sns_topic_to_notify_on_failure != null ? [var.sns_topic_to_notify_on_failure] : []
    iterator = sns_topic_arn
    content {
      target_arn = sns_topic_arn.value
    }
  }
}

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/lambda/${aws_lambda_function.lambda.function_name}"
  retention_in_days = 7
}

resource "aws_iam_role" "lambda_execution_role" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lamdba_iam_policy" {
  role = aws_iam_role.lambda_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow"
        Action   = "ecs:UpdateService"
        Resource = "*"
      },
      {
        "Effect" = "Allow"
        "Action" = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" = "${aws_cloudwatch_log_group.log_group.arn}:*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "allow_sns_topic_notification" {
  count = var.sns_topic_to_notify_on_failure != null ? 1 : 0
  role  = aws_iam_role.lambda_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow"
        Action   = "sns:Publish"
        Resource = var.sns_topic_to_notify_on_failure
      }
    ]
  })
}

resource "aws_lambda_permission" "allow_invocation_from_sns" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.sns_topic.arn
}

resource "aws_sns_topic" "sns_topic" {
  name = aws_lambda_function.lambda.function_name
}

resource "aws_sns_topic_policy" "sns_topic_policy" {
  arn = aws_sns_topic.sns_topic.arn

  policy = jsonencode({
    "Version" = "2012-10-17"
    "Statement" = [
      {
        "Effect" = "Allow"
        "Principal" = {
          "Service" = "cloudwatch.amazonaws.com"
        },
        "Resource" = aws_sns_topic.sns_topic.arn
        "Action" = "SNS:Publish"
        "Condition" = {
          "ArnLike" = {
            "aws:SourceArn": "arn:aws:cloudwatch:*:${var.account_id}:*"
          }
        }
      }
    ]
  })
}

resource "aws_sns_topic_subscription" "sns_topic" {
  topic_arn = aws_sns_topic.sns_topic.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.lambda.arn
}