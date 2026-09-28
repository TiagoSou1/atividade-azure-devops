const sql=require('./app/node_modules/mssql');
const fs=require('fs');
(async()=>{
  const pool=await sql.connect({server:process.env.DB_SERVER,database:process.env.DB_NAME,user:process.env.DB_USER,password:process.env.DB_PASSWORD,options:{encrypt:true,trustServerCertificate:false}});
  const result=await pool.request().query(fs.readFileSync(require('path').join(__dirname, 'seed.sql'),'utf8'));
  console.table(result.recordset);
  if(result.recordset.length!==5) throw new Error('Esperados cinco jogos');
  await pool.close();
})().catch(err=>{console.error(err.message);process.exit(1)});
