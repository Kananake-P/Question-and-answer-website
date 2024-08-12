import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionRouter = Router();
questionRouter.post("/", async (req, res) => {
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };
  try {
    await connectionPool.query(
      `insert into questions(title, description, category)
        values ($1,$2,$3)`,
      [newPost.title, newPost.description, newPost.category]
    );
  } catch {
    return res
      .status(500)
      .json("Server could not create question because database connection");
  }

  if (!newPost.title || !newPost.description || !newPost.category) {
    return res.status(400).json("Missing or invalid request data");
  }

  return res.status(201).json(newPost);
});

questionRouter.get("/", async (req, res) => {
  let results;
  try {
    results = await connectionPool.query(`select * from questions`);
  } catch {
    return res
      .status(500)
      .json("Server could not read question beacause database connection");
  }
  return res.status(200).json(results.rows);
});

questionRouter.get("/:id", async (req, res) => {
  const questionIdFromClient = req.params.id;
  let results;
  try {
    results = await connectionPool.query(
      `select * from questions where id = $1`,
      [questionIdFromClient]
    );
  } catch {
    return res
      .status(500)
      .json("Server could not read because database connection ");
  }

  if (!results.rows[0]) {
    return res.status(404).json("Question not found");
  }

  return res.status(200).json(results.rows[0]);
});

questionRouter.put("/:id", async (req, res) => {
  const questionIdFromClient = req.params.id;
  const updateQuestion = { ...req.body, updated_at: new Date() };

  try {
    await connectionPool.query(
      `
        update questions
        set title = $2,
            description = $3,
            category = $4,
            updated_at = $5
            where id = $1
        `,
      [
        questionIdFromClient,
        updateQuestion.title,
        updateQuestion.description,
        updateQuestion.category,
        updateQuestion.updated_at,
      ]
    );
    if (!questionIdFromClient) {
      return res.status(404).json("Question not found");
    }
    return res.status(200).json(updateQuestion);
  } catch {
    return res
      .status(500)
      .json("Server could not update because database connection");
  }
});

questionRouter.delete("/:id", async (req, res) => {
  const questionIdFromClient = req.params.id;

  try {
    await connectionPool.query(
      `delete from questions
        where id = $1`,
      [questionIdFromClient]
    );

    if (!questionIdFromClient) {
      return res.status(404).json("Question not found");
    }
    return res.status(200).json("Question deleted successfully");
  } catch {
    return res
      .status(500)
      .json("Server could not delete because database connection");
  }
});

export default questionRouter;
