const readline = require('readline');

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})


rl.question("Enter your github username: ",async(username)=>{
    rl.close();
    await getUserGithubDetail(username.trim());
})

async function getUserGithubDetail(username) {

    try {
    const res = await fetch(`https://api.github.com/users/${username}/events`)
    if(!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
    const events = await res.json();

    console.log(`GitHub activity for user ${username}: \n`);

    events.slice(0,5).forEach(event => {
        

        const repo = event.repo?.name
        const type = event.type

        switch(type){
            case "PushEvent":
                console.log(`Pushed ${event.payload.commits.length} commits to ${repo} `);
                break;
            case "IssueEvent":
                console.log(` ${event.payload.action === "opened" ? "Opened" : "Updated"} an issue in ${repo} `);
                break;
            case "WatchEvent":
                console.log(` Starred ${repo} `);
                break;
            case "CreateEvent":
                console.log(`Create a new ${event.payload.ref_type} in ${repo} `);
                break;


            default:
            console.log(`- ${type.replace("Event", "")} in ${repo}`);
        }
        
    });
        
    } catch (error) {
        console.error("Fetch failed:", error.message);
        
    }
    
    
}


