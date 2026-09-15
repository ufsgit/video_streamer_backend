require('dotenv').config();
const db = require('./db');

async function run() {
    try {
        const [sp1] = await db.query("SHOW CREATE PROCEDURE user_create");
        console.log("SP create:", sp1[0]['Create Procedure']);
        const [sp2] = await db.query("SHOW CREATE PROCEDURE user_edit");
        console.log("SP edit:", sp2[0]['Create Procedure']);
        const [sp3] = await db.query("SHOW CREATE PROCEDURE user_getbyid");
        console.log("SP getbyid:", sp3[0]['Create Procedure']);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
