const SEQUELIZE = require('sequelize');
module.exports.checkIfVetIsFreeOnDate = async function(sequelize,vet_id,date){
    let isFree = false;
    const dateHourPLus = new Date(date)
    dateHourPLus.setHours(dateHourPLus.getHours()+1);

    try {
        const response =  await sequelize.query(`
        select vet_id from vet_visits
        where visit_date>='${date.toISOString()}' AND visit_date<'${dateHourPLus.toISOString()}' AND vet_id=${vet_id};`,
        {
            logging:false,
            plain:true,
            type:SEQUELIZE.QueryTypes.SELECT
        });

        isFree = !response; 

    } catch (error) {
        console.log("[ERROR in checkIfVetIsFreeOnDate]:",error.message);
    }

    return isFree;
}