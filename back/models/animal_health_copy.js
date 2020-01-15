const VIEW_NAME = "animal_health";

module.exports = function() {
    const crud = {
        select: undefined,
        update: undefined,
        insert: undefined,
        delete: undefined
    };

    crud.select = async (sequelize) => {
        return await sequelize.query(`SELECT * FROM ${VIEW_NAME};`, {
            plain: false,
            raw: true,
            type: sequelize.QueryType.SELECT
        });
    };

    crud.update = async (sequelize) => {
        return await sequelize.query(`SELECT * FROM ${VIEW_NAME};`, {
            plain: false,
            raw: true,
            type: sequelize.QueryType.SELECT
        });
    };

    return crud;
};
