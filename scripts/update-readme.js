const fs = require('fs');
const axios = require('axios');

async function getRepos() {
  const response = await axios.get('https://api.github.com/user/repos', {
    headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
  });
  return response.data;
}

async function updateReadme() {
  const repos = await getRepos();
  const technologies = new Set();

  repos.forEach(repo => {
    if (repo.language) {
      technologies.add(repo.language);
    }
  });

  const badges = Array.from(technologies).map(tech => `!${tech}`).join(' ');

  let readmeContent = fs.readFileSync('../README.md', 'utf8');
  readmeContent = readmeContent.replace(/<!-- TECHNOLOGIES:START -->[\s\S]*<!-- TECHNOLOGIES:END -->/, `<!-- TECHNOLOGIES:START -->\n${badges}\n<!-- TECHNOLOGIES:END -->`);

  fs.writeFileSync('README.md', readmeContent);
}

updateReadme();
