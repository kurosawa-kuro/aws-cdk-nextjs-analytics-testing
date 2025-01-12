# Public targets
.PHONY: first-deploy reset-deploy destroy

# Initial deployment
first-deploy: _validate-env _install-deps
	@echo "🚀 Starting first deployment..."
	cdk deploy --require-approval never
	@echo "✅ First deployment completed!"

# Reset and redeploy
reset-deploy: destroy first-deploy
	@echo "🔄 Reset deployment completed!"

# Destroy stack
destroy:
	@echo "🔥 Destroying stack..."
	cdk destroy --force
	@echo "🗑️ Stack destroyed!"

# Private targets
.PHONY: _validate-env _install-deps

# Validate environment
_validate-env:
	@echo "🔍 Validating environment..."
	node -v
	pnpm -v
	psql --version

# Install dependencies
_install-deps:
	@echo "📦 Installing dependencies..."
	pnpm install
