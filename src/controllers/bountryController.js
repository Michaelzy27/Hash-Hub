const pool = require('./../db');

exports.getBounties = async (req, res) => {

    try {
        
        const result = await pool.query(`SELECT * FROM bounties`);

        if(result.rows.length === 0 || !result) {
            return res.status(404).json({
                status: 'fail',
                message: 'There are no bounties available'
            })
        }

        const bounties = result.rows;

        res.status(200).json({
            status: 'success',
            message: 'Bonties fecthed successfully',
            data: {
                bounties
            }
        });


    } catch (error) {
        console.log("Error fetching bounties: ", error);
        
        res.status(500).json(({
            status: 'fail',
            error: "Internal serval error"
        }))
    }

}

exports.addBounty = async (req, res) => {

    try {

        const { title, description, projectName, amount, status, category, skillLevel, image, deadline } = req.body;
        
        const result = await pool.query(`INSERT INTO bounties (title, description, project_name, amount, status, category, skill_level, image, deadline) 
            VALUES ($1, $2, $3, $4, $5, $6, $7,$8, $9) RETURNING *`, [title, description, projectName, amount, status, category, skillLevel, image, deadline]);

        const bounty = result.rows[0];
        
        res.status(200).json({
            status: 'success',
            message: 'Bounty added successfully',
            data: {
                bounty
            }
        })


    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: 'fail',
            message: error
        })
        
    }


}