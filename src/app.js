const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, techs, url } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)
  if (repositoryIndex < 0)
    return response.status(400).json({ erro: "Repository not found" });

  const { likes } = repositories[repositoryIndex];

  const currentRespository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = currentRespository;

  return response.json(currentRespository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)


  if (repositoryIndex < 0) {
    return response.status(400).json({ erro: "Project not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ erro: "Project not found" });
  }

  const repository = repositories.find(repository => repository.id === id)
  repository.likes += 1;



  return response.json(repository);
});

module.exports = app;
