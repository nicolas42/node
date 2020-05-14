/*
Deploy
rm function.zip; zip -r function.zip index.js node_modules; aws lambda update-function-code --function-name update-database --zip-file fileb://function.zip;

Docs
https://docs.aws.amazon.com/lambda/latest/dg/services-rds-tutorial.html
https://www.npmjs.com/package/mssql
https://javascript.info/async

Debug
AWS.config.logger = process.stdout;

*/
const sql = require('mssql')
var AWS = require('aws-sdk');
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const toGeojson = require('gopro-telemetry/code/toGeojson');


exports.handler = function (event, context) {

    const database = 'mssql://admin:4bMneTY0p6tA@greenview1.coteoxtuwiez.ap-southeast-2.rds.amazonaws.com/greenview-db-1';

    console.log('Hello');
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(context));
    console.log(JSON.stringify(event.Records[0].s3.bucket.name));
    console.log(JSON.stringify(event.Records[0].s3.object.key));
    let bucket = event.Records[0].s3.bucket.name;
    let key = event.Records[0].s3.object.key;

    // Make GeoJSON
    // let bucket = 'greenview-fpg';
    // let key = 'GH010011.MP4';
    let filename = key.split('/')[key.split('/').length - 1];


    process.stdout.write('Downloading s3://'+bucket+'/'+key+'...');
    new AWS.S3().getObject({ Bucket: bucket, Key: key }, function (err, resp) {

        process.stdout.write('Done.\n');
        file = resp.Body;


        gpmfExtract(file).then(function (extracted) {

            let telemetry = goproTelemetry(extracted);
            let geojson = toGeojson(telemetry, {});

            console.dir(geojson);
            
            // Generate SQL
            let sql_mediatimeline = "INSERT INTO [dbo].[MediaTimeline] ( [RelativeTime] ,[Gps] ,[MediaId] ) VALUES\n"
            let out = [];
            var len = Math.min(geojson.properties.RelativeMicroSec.length, geojson.geometry.coordinates.length);
            for (let i = 0; i <= len - 1; i += 1) {
                out.push(
                    "(\'" +
                    geojson.properties.RelativeMicroSec[i].toString() +
                    "\',\'[" +
                    geojson.geometry.coordinates[i].toString() +
                    "]\'" +
                    " , IDENT_CURRENT( 'Media' ))"
                );
            };
            sql_mediatimeline = sql_mediatimeline + out.join(",\n");


            let sql1 = `INSERT INTO [dbo].[Media] ([Name],[Ext],[Type],[RelativeTimeUnit],[ObsInstanceId]) VALUES ('${filename}','MP4','VIDEO', 'Milliseconds', (
                SELECT [Id] FROM [ObsInstance] WHERE Code = 'PN' AND ObsDefId = ( SELECT [Id] FROM [ObsDef] WHERE Name = 'Jinglers Creek Org Breakdown Structure' ) ) )`;

            let sql2 = sql_mediatimeline;
            
            let sql3 = `select * from Media`;

            sql.connect(database, function (err, result) {
                sql.query(sql1, function (err, result) {
                    sql.query(sql2, function (err, result) {
                        sql.query(sql3, function (err, result){
                            console.dir(result.recordset[result.recordset.length - 1]);
                            sql.close();
                        })
                    });
                });
            });


        })

    });





}