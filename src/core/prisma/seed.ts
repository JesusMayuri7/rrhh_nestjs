import { PrismaClient} from ".prisma/client";

const prisma = new PrismaClient();

//Detener el servidor antes de actualizar el esquema y/o migrar datos

async function main(){

/*       const tableNames = ['datoLaboralAirDetalle','DatoLaboralAir','CodigoAirDetalle','CodigoAirExt','CodigoAir',
    'FrecuenciaEntrega', 'FrecuenciaMes','ModalidadEntrega'];
    for (const tableName of tableNames) 
    {
      await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
    }  */

    const result = await prisma.modalidadEntrega.createMany({
      data: [
        { descModalidadEntrega: "MENSUAL",modalidadId:1},
        { descModalidadEntrega: "PERIODICO",modalidadId:1},
        { descModalidadEntrega: "SEMESTRAL",modalidadId:1},          
        { descModalidadEntrega: "UNICA",modalidadId:1},          
        { descModalidadEntrega: "CORRESPONDA",modalidadId:1},          
        { descModalidadEntrega: "CESE",modalidadId:1}
      ] });  

     await prisma.frecuenciaMes.createMany({
        data: [
          {descFrecuenciaMes: "NINGUNO",modalidadContratoId:1},
          {descFrecuenciaMes: "ENERO",modalidadContratoId:1},
          {descFrecuenciaMes: "FEBRERO",modalidadContratoId:1},
          {descFrecuenciaMes: "MARZO",modalidadContratoId:1},
          {descFrecuenciaMes: "ABRIL",modalidadContratoId:1},
          {descFrecuenciaMes: "MAYO",modalidadContratoId:1},
          {descFrecuenciaMes: "JUNIO",modalidadContratoId:1},
          {descFrecuenciaMes: "JULIO",modalidadContratoId:1},
          {descFrecuenciaMes: "AGOSTO",modalidadContratoId:1},
          {descFrecuenciaMes: "SETIEMBRE",modalidadContratoId:1},
          {descFrecuenciaMes: "OCTUBRE",modalidadContratoId:1},
          {descFrecuenciaMes: "NOVIEMBRE",modalidadContratoId:1},
          {descFrecuenciaMes: "DICIEMBRE",modalidadContratoId:1},            
       ],skipDuplicates: true }); 

       await prisma.frecuenciaEntrega.createMany({
        data: [
          {descFrecuenciaEntrega: "PERMANENTE",modalidadContratoId:1},
          {descFrecuenciaEntrega: "PERIODICO",modalidadContratoId:1},
          {descFrecuenciaEntrega: "OCASIONAL",modalidadContratoId:1},          
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