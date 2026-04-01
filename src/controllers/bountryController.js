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

        //Get all requirements and submissions for each bounty
        const resultBounties = await Promise.all(
            bounties.map(async (b) => {

                let requirements;
                let submissionsCount;

                //try to get the requirements
                try {
                    
                    const reqResult = await pool.query(`SELECT * FROM requirements WHERE id = $1`, [b.id])
                    requirements = reqResult.rows

                } catch (error) {
                    console.log("Error getting requirements: ", error);
                }

                //try to get submissions count
                try {
                    const subResult = await pool.query(`SELECT * FROM submissions WHERE id = $1`, [b.id])
                    submissionsCount = subResult.rows.length
                } catch (error) {
                    console.log("Error getting submissions: ", error);

                }

                return {...b, submissions: submissionsCount, requirements: requirements}

            })
        )

        // flatten since Promise.all returns an array of arrays
        const newBounties = resultBounties.flat();  

        const Bounties = newBounties.map( b => ({
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
            message: 'Bounties fecthed successfully',
            data: {
                bounties: Bounties
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

        const { title, description, project, reward, currency, status, category, difficulty, requirements, projectLogo, dueDate } = req.body;
        
        // id: string;
        // title: string;
        // project: string;
        // projectLogo: string;
        // category: "Development" | "Design" | "Content" | "Community" | "Other";
        // reward: number;
        // currency: string;
        // status: "open" | "in-review" | "completed" | "expired";
        // dueDate: string;
        // submissions: number;
        // difficulty: "Beginner" | "Intermediate" | "Advanced";
        // description: string;
        // requirements: string[];
        // verified: boolean;

        //insert bounty into table
        const result = await pool.query(`INSERT INTO bounties (title, description, project_name, reward, currency, status, category, skill_level, project_logo, due_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7,$8, $9, $10) RETURNING *`, [title, description, project, reward, currency, status, category, difficulty, projectLogo, dueDate]);

        const bounty = result.rows[0];

        //insert requirements into table
        await Promise.all(
            requirements.map(async (r) => {
                try {
                    await pool.query(`INSERT INTO requirements (bounty_id, requirement) VALUES ($1, $2) RETURNING *`, [bounty.id, r])
                } catch (error) {
                    console.log("Error inserting requirements: ", error);
                }
            })
        )
        
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

exports.submitBounty = async (req, res) => {
    try {

        const { bountyId, submissionLink, tweeterLink, otherLinks } = req.body
        
        const result = await pool.query(`INSERT INTO submissions (bounty_id, submission_link, 
            tweet_link, other) VALUES ($1, $2, $3, $4) RETURNING *`, 
            [bountyId, submissionLink, tweeterLink, otherLinks])

        if(result.rows.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Error submitting'
            })
        }

        res.status(200).json({
            status: 'success',
            message: 'Submission successful'
        })

    } catch (error) {
        console.log("Bounty submission error: ", error);
        
        res.status(500).json({
            status: 'fail',
            message: 'Error submitting bounty. Try again later'
        })
    }
}