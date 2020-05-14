/*
Deploy
rm function.zip; zip -r function.zip index.js node_modules; aws lambda update-function-code --function-name update-database --zip-file fileb://function.zip;

Docs
https://docs.aws.amazon.com/lambda/latest/dg/services-rds-tutorial.html
https://www.npmjs.com/package/mssql

*/
const sql = require('mssql')
var AWS = require('aws-sdk');
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const toGeojson = require('gopro-telemetry/code/toGeojson');

const database = 'mssql://admin:4bMneTY0p6tA@greenview1.coteoxtuwiez.ap-southeast-2.rds.amazonaws.com/greenview-db-1';





// Make GeoJSON
let geojson;
let bucket = 'bitwise-training-videos';
let key = 'greenview-fpg-b11/GH010002.MP4';
let filename = key.split('/')[key.split('/').length - 1];


process.stdout.write('Downloading...');
new AWS.S3().getObject({ Bucket: bucket, Key: key }, function (err, resp) {

    process.stdout.write('Done.\n');
    file = resp.Body;


    gpmfExtract(file).then(function (extracted) {
        
        let telemetry = goproTelemetry(extracted);
        geojson = toGeojson(telemetry, {});

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


        let filename = 'file' + Date.now().toString();
        let sql1 = `INSERT INTO [dbo].[Media] ([Name],[Ext],[Type],[RelativeTimeUnit],[ObsInstanceId]) VALUES ('${filename}','MP4','VIDEO', 'Milliseconds', (
                SELECT [Id] FROM [ObsInstance] WHERE Code = 'PN' AND ObsDefId = ( SELECT [Id] FROM [ObsDef] WHERE Name = 'Jinglers Creek Org Breakdown Structure' ) ) )`;

        let sql2 = `select * from Media`;

        sql.connect(database, function (err, result) {
            sql.query(sql1, function (err, result) {
                sql.query(sql2, function (err, result) {
                    console.dir(result.recordset[result.recordset.length - 1]);
                    sql.close();
                });
            });
        });


    })

});





