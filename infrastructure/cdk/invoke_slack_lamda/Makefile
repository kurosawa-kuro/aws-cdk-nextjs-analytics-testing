# ===========================================
# Configuration Layer
# ===========================================
# AWS Configuration
AWS_ACCOUNT_ID = 985539793438
REGION_TOKYO = ap-northeast-1

# CDK Configuration
CDK = cdk
DEPLOY_FLAGS = --require-approval never
DESTROY_FLAGS = --force --debug

NOTIFY_MESSAGES = { \
    deploy: "$(NOTIFY_PREFIX)_Deployment_completed", \
    destroy: "$(NOTIFY_PREFIX)_Stack_destruction_completed", \
    first_deploy: "$(NOTIFY_PREFIX)_First_deployment_completed", \
    reset_deploy: "$(NOTIFY_PREFIX)_Reset_and_redeploy_completed" \
}

# ===========================================
# Utility Layer
# ===========================================
# Logging Utilities
#   info: '\x1b[32m', // 緑色
#   error: '\x1b[31m', // 赤色
#   warn: '\x1b[33m', // 黄色
#   debug: '\x1b[34m', // 青色
#   processStart: '\x1b[38;5;208m', // オレンジ
#   processEnd: '\x1b[36m' // シアン

# AWS Operation Utilities
define bootstrap_regions
	$(call log_section,Bootstrapping CDK in Tokyo region)
	$(CDK) bootstrap aws://$(AWS_ACCOUNT_ID)/$(REGION_TOKYO) \
		--cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
		--trust $(AWS_ACCOUNT_ID) \
		--force
	$(call log_end_section)
endef

define check_failed_stacks
	$(call log_section,Checking for failed CloudFormation stacks)
	@aws cloudformation list-stacks \
		--region $(REGION_TOKYO) \
		--query 'StackSummaries[?StackStatus!=`DELETE_COMPLETE` && StackStatus!=`CREATE_COMPLETE` && StackStatus!=`UPDATE_COMPLETE`].[StackName,StackStatus,StackStatusReason]' \
		--output table || true
	$(call log_end_section)
endef

# Notification Utility
define send_notification
	$(call log_section,Sending notification)
	@cd ../../script/test-slack-notification/lambda && AWS_REGION=$(REGION_TOKYO) node send_notification.js '$(1)'
	$(call log_end_section)
endef

# ===========================================
# Operation Layer
# ===========================================
.PHONY: first-deploy reset-deploy destroy test-slack-notification

# Primary Operations
first-deploy:
	cdk deploy

reset-deploy:
	cdk destroy
	cdk deploy

destroy:
	cdk destroy

