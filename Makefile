precommit:
	@cp .github/hooks/pre-commit .git/hooks/pre-commit
	echo "precommit: hook successfully configured"

install: precommit
	npm install

ifndef VERBOSE
.SILENT:
endif
