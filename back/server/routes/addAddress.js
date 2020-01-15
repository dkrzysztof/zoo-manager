module.exports.addAddress = async function(sequelizer, addressInfo, t) {
    const userAddress = await sequelizer.models.addresses.findOne({
        where: addressInfo
    });

    if (!userAddress) {
        return await sequelizer.models.addresses.create(addressInfo, {
            transaction: t
        });
    }
    return userAddress;
}
