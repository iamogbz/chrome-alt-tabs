upstream:
	@git remote add upstream https://github.com/iamogbz/node-js-boilerplate
	@git push origin master
	@git push --all
	echo "upstream: remote successfully configured"

ifndef VERBOSE
.SILENT:
endif
