// Netlify Serverless Function — GitHub Deploy Proxy
// Admin panel → POST here → commits data/site-data.json to GitHub

export async function handler(event) {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    // GitHub token from Netlify environment variable
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.REPO_OWNER || 'shahmuradovk';
    const REPO_NAME = process.env.REPO_NAME || 'busamania-netlify';
    const BRANCH = process.env.BRANCH || 'main';

    if (!GITHUB_TOKEN) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'GITHUB_TOKEN environment variable not set' })
        };
    }

    try {
        const siteData = JSON.parse(event.body);
        const content = Buffer.from(JSON.stringify(siteData, null, 2)).toString('base64');
        const filePath = 'data/site-data.json';
        const apiBase = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;

        // Get current file SHA
        let sha = null;
        try {
            const getRes = await fetch(`${apiBase}?ref=${BRANCH}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'User-Agent': 'Busamania-Deploy'
                }
            });
            if (getRes.ok) {
                const data = await getRes.json();
                sha = data.sha;
            }
        } catch (e) {
            // File may not exist yet — that's fine
        }

        // Commit the file
        const commitBody = {
            message: `Admin panel update — ${new Date().toISOString()}`,
            content: content,
            branch: BRANCH
        };
        if (sha) commitBody.sha = sha;

        const putRes = await fetch(apiBase, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Busamania-Deploy'
            },
            body: JSON.stringify(commitBody)
        });

        if (putRes.ok) {
            const result = await putRes.json();
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Deploy uğurla göndərildi!',
                    commit: result.commit?.sha?.substring(0, 7) || 'ok'
                })
            };
        } else {
            const err = await putRes.json();
            return {
                statusCode: putRes.status,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: err.message || 'GitHub API xətası'
                })
            };
        }
    } catch (e) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: e.message })
        };
    }
}
