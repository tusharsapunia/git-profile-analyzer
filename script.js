const userDetails = document.querySelector(".userDetails");
const repoDetails = document.querySelector(".repoDetails");
const loader = document.querySelector(".loader");
const showloader = () => {
  loader.style.display = "block";
};
const getUsername = () => {
  let usernameInput = document.getElementById("usernameInput");
  username = usernameInput.value;
  if (!username) {
    alert("Please Enter Username.");
    return;
  }
  usernameInput.value = "";
  userDetails.innerHTML = "";
  repoDetails.innerHTML = "";
  Promise.all([searchUser(username), fetchRepo()]);
};

const searchUser = async (username) => {
  try {
    showloader();
    const url = `https://api.github.com/users/${username}`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (res.status === 404) {
      throw new Error("User not found");
    }

    let data = await res.json();

    displayUserDetails(data);

    saveUsernameHistory(username);
  } catch (err) {
    userDetails.innerHTML = err;
  } finally {
    loader.style.display = "none";
  }
};
const fetchRepo = async () => {
  try {
    showloader();
    const url = `https://api.github.com/users/${username}/repos`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (res.status === 404) {
      throw new Error("User Data not found");
    }
    let repodata = await res.json();

    displayLanguageOfRepo(repodata);
    Toprepo(repodata);
  } catch (error) {
    repoDetails.innerHTML = error;
  } finally {
    loader.style.display = "none";
  }
};

const displayUserDetails = (data) => {
  console.log(data);
  userDetails.innerHTML = "";
  let datee = new Date(`${data.created_at}`);
  let formattedDate = datee.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  let div = document.createElement("div");

  div.classList.add("createDiv");
  div.innerHTML = `
  
  <p><span>Name :</span> ${data.name}</p>
  <p><span>Username :</span> ${data.login}</p>
  <p><span>Followers:</span>${data.followers}</p>
  <p><span>Followings:</span> ${data.following}</p>
  <p><span>Repositories:</span> ${data.public_repos}</p>
  <p><span>Join-Date :</span> ${formattedDate}</p>
  <p><span>Bio: </span>${data.bio}</p>
  <p><span>Profile-Url: </span><a href='${data.html_url}'> Visit </a></p>
  `;
  userDetails.append(div);
};

const displayLanguageOfRepo = (data) => {
  repoDetails.innerHTML = "";
  let languagecount = {};
  let div = document.createElement("div");

  div.classList.add("createDiv");

  data.forEach((repo) => {
    let language = repo.language;
    if (language) {
      if (languagecount[language]) {
        languagecount[language]++;
      } else {
        languagecount[language] = 1;
      }
    }
  });
  Object.entries(languagecount).forEach(([key, pair]) => {
    div.innerHTML += `
    <p>${key} : ${pair}</p>`;
  });
  repoDetails.append(div);
};

const Toprepo = (data) => {
  let totalRepo = data.length;

  let top = [...data]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  let highestRepo = top[0];

  console.log(`Total Repos :- ${totalRepo}`);

  console.log("Top 5 Repos :- \n");
  top.forEach((repo) => {
    console.log(`${repo.name} : ${repo.stargazers_count}`);
  });

  console.log(
    `Highest Star Repo :- \n ${highestRepo.name} : ${highestRepo.stargazers_count} `,
  );

  let totalStar = [...data].reduce((total, star) => {
    return (total += star.stargazers_count);
  }, 0);
  console.log(`Total Star :- ${totalStar}`);
};

const saveUsernameHistory = (username) => {
  let history = JSON.parse(localStorage.getItem("searchUser")) || [];
  history = history.filter((user) => user !== username);

  history.unshift(username);

  history = history.slice(0, 5);

  localStorage.setItem("searchUser", JSON.stringify(history));
};
