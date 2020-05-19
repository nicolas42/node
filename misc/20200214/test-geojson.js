
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');
const toGeojson = require('gopro-telemetry/code/toGeojson');

const file = fs.readFileSync('/Users/nick2/bitwise/20200206-bitwise_large_files/GH010002.MP4');
let telemetry;
let geojson;

(async () => {
    let extracted = await gpmfExtract(file);
    telemetry = goproTelemetry(extracted);
    geojson = toGeojson(telemetry, {});
})();




// Want to get
// ('87476.2777777777','[147.195302, -41.5031227, 76.124]' , IDENT_CURRENT( 'Media' ))
// ('25967.117647058796','[142.2391653,-34.3423457,54.27937356048543]' , IDENT_CURRENT( 'Media' )),






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

let a = "INSERT INTO [dbo].[MediaTimeline] ( [RelativeTime] ,[Gps] ,[MediaId] ) VALUES\n"+out.slice(0,10).join(",\n");


