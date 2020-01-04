module.exports = function() {
    let crud = {
        select: undefined,
        update: undefined,
        insert: undefined,
        delete: undefined
    };

    crud.select = async (sequelize) => {
        return await sequelize.query(`SELECT * FROM animal_details;`, {
            plain: false,
            raw: true,
            type: sequelize.QueryType.SELECT
        });
    };

    crud.update = async (sequelize) => {
        return await sequelize.query(`SELECT * FROM animal_details;`, {
            plain: false,
            raw: true,
            type: sequelize.QueryType.SELECT
        });
    };

    return crud;
};
