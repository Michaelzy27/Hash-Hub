const pool = require('./../db')

exports.createSponsor = async (req, res) => {
    try {

        console.log("Sponsor deets: ", req.body, req.files);
        
        const { companyName, companyUsername, companyUrl, companyTwitter, entityName, industry, companyBio } = req.body
        const companyLogo = req.files?.companyLogo?.[0].buffer.toString("base64");

        const result = await pool.query(`INSERT INTO sponsors (user_id, name, username, 
            website_url, twitter_handle, entity_name, logo, industry, biography) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, 
            [req.user.id, companyName, companyUsername, companyUrl, companyTwitter, entityName, companyLogo, industry, companyBio])

        //update users table to set is_sponsor to true for the user
        await pool.query(`UPDATE users SET is_sponsor = $1 WHERE id = $2`, [true, req.user.id]);
        
        res.status(200).json({
            status: 'success',
            message: 'Sponsor profile created successfully'
        })

    } catch (error) {
        console.log("Error creating sponsor: ", error);
        
        res.status(500).json({
            status: 'fail',
            message: 'Sponsor profile creation error'
        })
    }
}

exports.getSponsorData = async (req, res) => {
    try {
        
        const userId = req.user.id

        const result = await pool.query(`SELECT * FROM sponsors WHERE user_id = $1`, [userId])

        console.log("Sponsor details: ", result.rows);

        const sponsorResult = result.rows[0]

        const Sponsor = {
            companyName: sponsorResult.name,
            companyUsername: sponsorResult.username,
            companyUrl: sponsorResult.website_url,
            companyTwitter: sponsorResult.twitter_handle,
            companyLogo: sponsorResult.logo,
            companyBio: sponsorResult.biography,
            industry: sponsorResult.industry,
            entityName: sponsorResult.entityName ?? ""
        }

        res.status(200).json({
            status: 'success',
            message: 'Sponsor retrieved successfully',
            data: {
                sponsor: Sponsor
            }
        })

    } catch (error) {
        console.log("Sponsor data error", error);
        res.send(500).json({
            status: 'fail',
            message: 'server error'
        })
    }
}

exports.getSponsorBounties = async (req, res) => {
    try {
        //get bounties belonging to sponsor using user id from req.user
        const result = await pool.query(`SELECT b.* FROM bounties b JOIN sponsors s ON b.project_name = s.name WHERE s.user_id = $1`, [req.user.id])
        
        const bounties = result.rows;

        const submissionsResult = await Promise.all(
            bounties.map( b => pool.query(`SELECT COUNT(*) FROM submissions WHERE bounty_id = $1`, [b.id])  )
        )

        const Bounties = bounties.map( b => ({
            id: b.id,
            title: b.title,
            project: b.project_name,
            projectLogo: b.project_logo,
            category: b.category,
            reward: b.reward,
            currency: b.currency,
            status: b.status,
            dueDate: b.due_date,
            submissions: b.submissions,
            difficulty: b.skill_level,
            description: b.description,
            requirements: b.requirements,
            verified: true,
        }))

        res.status(200).json({
            status: 'success',
            message: 'Sponsor bounties retrieved successfully',
            data: {
                bounties: Bounties
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: 'Server error'
        })
    }
}