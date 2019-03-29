precommit:
	@ln -sf $(PWD)/.github/hooks/pre-commit .git/hooks/pre-commit
	echo "precommit: hook successfully configured"

upstream:
	@git remote add upstream https://github.com/iamogbz/oss-boilerplate
	@git push origin master
	@git push --all
	echo "upstream: remote successfully configured"

ifndef VERBOSE
.SILENT:
endif
