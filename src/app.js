const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({message: 'Id inválido. Verifique e tente novamente.'});
  }

  return next();
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs || techs.length <= 0) {
    return response.status(400).json({message: 'Dados inválidos para a criação de um novo repositório. Verifique e tente novamente.'});
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({message: 'Id não encontrado. Verifique e informe novamente.'});
  }

  // if (!title && !url && !techs) {
  //   return response.status(400).json({message: 'Dados inválidos para a criação de um novo repositório. Verifique e tente novamente.'});
  // }

  const repository = {
    ...repositories[repositoryIndex],
    title: title || repositories[repositoryIndex].title,
    url: url || repositories[repositoryIndex].url,
    techs: techs || repositories[repositoryIndex].techs,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({message: 'Id não encontrado. Verifique e informe novamente.'});
  }

  repositories.splice(repositoryIndex, 1);


  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({message: 'Id não encontrado. Verifique e informe novamente.'});
  }

  const repository = {
    ...repositories[repositoryIndex],
    likes: ++repositories[repositoryIndex].likes,
  };

  return response.json(repository);
});

module.exports = app;
