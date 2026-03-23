const pool = require('./../db')

exports.createSponsor = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            message: 'Sponsor profile created successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: 'Sponsor profile creation error'
        })
    }
}