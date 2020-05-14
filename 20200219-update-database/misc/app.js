const fs = require('fs');
const sql = require("mssql");


const config = {
    user: "admin",
    password: "4bMneTY0p6tA",
    server: "greenview1.coteoxtuwiez.ap-southeast-2.rds.amazonaws.com",
    database: "greenview-db-1"
};

let filepath = '/Users/nick2/bitwise/20200206-bitwise_large_files/GH010002.MP4';
let tmp = filepath.split('/');
let filename = tmp[tmp.length - 1];
// let filename = 'test' + Date.now().toString(); // testing


const file = fs.readFileSync(filepath);

mainAsync = async function () {
    
    // Interface with database
    try {
        console.log("Trying to connect:" + JSON.stringify(config, null, 2));
        let pool = await sql.connect(config);

        await sql.query(`INSERT INTO [dbo].[Media] ([Name],[Ext],[Type],[RelativeTimeUnit],[ObsInstanceId]) VALUES ('${filename}','MP4','VIDEO', 'Milliseconds', (
          SELECT [Id] FROM [ObsInstance] WHERE Code = 'PN' AND ObsDefId = ( SELECT [Id] FROM [ObsDef] WHERE Name = 'Jinglers Creek Org Breakdown Structure' ) ) )`);
        
        
        // const request = new sql.Request()
        // request.stream = true
        // request.query(mediatimeline_insert)
        // request.on('done', result => {
        //     console.log(result.rowsAffected)
        // })

        // await sql.query(mediatimeline_insert);




        let mediatimeline = await sql.query(`select * from MediaTimeline`);
        let media = await sql.query(`select * from Media`);
        console.dir(mediatimeline);
        console.log("===============");
        console.dir(media);


    } catch (err) {
        console.log("Error: " + err);
    }
}

mainAsync();



