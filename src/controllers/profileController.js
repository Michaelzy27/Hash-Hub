const pool =  require('./../db')

exports.getProfile = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.user.id])

        const user = result.rows[0]

        const User = {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            location: user.location,
            skills: [],
            twitterUsername: user.twitter_handle,
            avatarUrl: user.profile_picture,
            hederaWalletId: user.hedera_account_id,
            walletAddress: user.wallet_address,
            isProfileComplete: user.is_complete,
            isSponsor: user.is_sponsor
        }    

        res.status(200).json({
            status: 'success',
            message: 'User profile retrieved successfully',
            data: {
                user: User
            }
        })
    } catch (error) {
        
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const result = await pool.query(`UPDATE users SET `)
    } catch (error) {
        
    }
}