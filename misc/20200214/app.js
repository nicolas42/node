var AWS = require('aws-sdk');
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const toGeojson = require('gopro-telemetry/code/toGeojson');
const sql = require("mssql");


const config = {
    user: "admin",
    password: "4bMneTY0p6tA",
    server: "greenview1.coteoxtuwiez.ap-southeast-2.rds.amazonaws.com",
    database: "greenview-db-1"
};

// process.env.AWS_REGION = 'ap-southeast-2';
// AWS.config.logger = process.stdout;

// let telemetry;
// let resp;
// let extracted;
// let file;
let geojson;

let bucket = 'bitwise-training-videos';
let key = 'greenview-fpg-b11/GH010002.MP4';
let filename = key.split('/')[key.split('/').length-1];


(async () => {
    process.stdout.write('Downloading...');
    resp = await new AWS.S3().getObject({Bucket: bucket, Key: key}).promise();
    process.stdout.write('Done.\n');
    file = resp.Body;
    extracted = await gpmfExtract(file);
    telemetry = goproTelemetry(extracted);
    geojson = toGeojson(telemetry, {});



    // Generate mediatimeline sql
    let out = [];
    let len = Math.min(geojson.properties.RelativeMicroSec.length, geojson.geometry.coordinates.length);
    for (let i=0; i<=len-1; i+=1){
        out.push(
            "(\'"+
            geojson.properties.RelativeMicroSec[i].toString()+
            "\',\'["+
            geojson.geometry.coordinates[i].toString()+
            "]\'"+
            " , IDENT_CURRENT( 'Media' ))"
        );
    };
    let mediatimeline_insert = "INSERT INTO [dbo].[MediaTimeline] ( [RelativeTime] ,[Gps] ,[MediaId] ) VALUES\n"+out.join(",\n");
    
    
    
    // Interface with database
    try {
        console.log("Trying to connect:" + JSON.stringify(config, null, 2));
        let pool = await sql.connect(config);

        await sql.query(`INSERT INTO [dbo].[Media] ([Name],[Ext],[Type],[RelativeTimeUnit],[ObsInstanceId]) VALUES ('${filename}','MP4','VIDEO', 'Milliseconds', (
          SELECT [Id] FROM [ObsInstance] WHERE Code = 'PN' AND ObsDefId = ( SELECT [Id] FROM [ObsDef] WHERE Name = 'Jinglers Creek Org Breakdown Structure' ) ) )`);
        

        // // Upload mediatimeline_insert
        // const request = new sql.Request()
        // request.stream = true
        // request.query(mediatimeline_insert)
        // request.on('done', result => {
        //     console.log(result.rowsAffected)
        // })


        // // Upload mediatimeline_insert
        // await sql.query(mediatimeline_insert);




        // // Check
        // let mediatimeline = await sql.query(`select * from MediaTimeline`);
        // let media = await sql.query(`select * from Media`);
        // console.dir(mediatimeline);
        // console.log("===============");
        // console.dir(media);


    } catch (err) {
        console.log("Error: " + err);
    }
    
})();


