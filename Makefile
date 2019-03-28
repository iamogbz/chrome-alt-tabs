precommit:
	@cp .github/hooks/pre-commit .git/hooks/pre-commit
	echo "precommit: hook successfully configured"

ifndef VERBOSE
.SILENT:
endif
