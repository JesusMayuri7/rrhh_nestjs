import { PrismaClient} from ".prisma/client";

const prisma = new PrismaClient();

//Detener el servidor antes de actualizar el esquema y/o migrar datos

async function main(){

      const tableNames = ['DatoLaboralAirDetalle','DatoLaboralAir','CodigoAirDetalle','CodigoAirExt','CodigoAir',
    'FrecuenciaEntrega', 'FrecuenciaMes','ModalidadEntrega'];
    for (const tableName of tableNames) 
    {
      await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
    } 

    const result = await prisma.modalidadEntrega.createMany({
      data: [
        { descModalidadEntrega: "MENSUAL"},
        { descModalidadEntrega: "PERIODICO"},
        { descModalidadEntrega: "SEMESTRAL"},          
        { descModalidadEntrega: "UNICA"},          
        { descModalidadEntrega: "CORRESPONDA"},          
        { descModalidadEntrega: "CESE"}
      ] });  

     await prisma.frecuenciaMes.createMany({
        data: [
          {descFrecuenciaMes: "NINGUNO"},
          {descFrecuenciaMes: "ENERO"},
          {descFrecuenciaMes: "FEBRERO"},
          {descFrecuenciaMes: "MARZO"},
          {descFrecuenciaMes: "ABRIL"},
          {descFrecuenciaMes: "MAYO"},
          {descFrecuenciaMes: "JUNIO"},
          {descFrecuenciaMes: "JULIO"},
          {descFrecuenciaMes: "AGOSTO"},
          {descFrecuenciaMes: "SETIEMBRE"},
          {descFrecuenciaMes: "OCTUBRE"},
          {descFrecuenciaMes: "NOVIEMBRE"},
          {descFrecuenciaMes: "DICIEMBRE"},            
       ],skipDuplicates: true }); 

       await prisma.frecuenciaEntrega.createMany({
        data: [
          {descFrecuenciaEntrega: "PERMANENTE"},
          {descFrecuenciaEntrega: "PERIODICO"},
          {descFrecuenciaEntrega: "OCASIONAL"},          
       ],skipDuplicates: true });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })