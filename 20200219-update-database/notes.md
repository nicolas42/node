Deploy

    	rm function.zip; \
	zip -r function.zip index.js node_modules; \
	aws lambda update-function-code --function-name update-database \
	--zip-file fileb://function.zip;

Invoke

	aws lambda invoke --function-name update-database \
	out --log-type Tail --query 'LogResult' --output text \
	|  base64 --decode

Docs

    https://docs.aws.amazon.com/lambda/latest/dg/services-rds-tutorial.html
    https://www.npmjs.com/package/mssql
    https://javascript.info/async

