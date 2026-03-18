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
            submissions: 0,
            difficulty: b.skill_level,
            description: b.description,
            requirements: [],
            verified: true,
        }))

        console.log("Bounties: ", Bounties);
        

        // const Bounty = {
        //     id: string,
        //     title: string,
        //     project: string,
        //     projectLogo: string,
        //     category: "Development" | "Design" | "Content" | "Community" | "Other",
        //     reward: number,
        //     currency: string,
        //     status: "open" | "in-review" | "completed" | "expired",
        //     dueDate: string,
        //     submissions: number,
        //     difficulty: "Beginner" | "Intermediate" | "Advanced",
        //     description: string,
        //     requirements: string[],
        //     verified: boolean,
        // }

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