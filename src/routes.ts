import { Router, Request, Response } from "express";
import UserController from "./controllers/user.controller";

const authRoutes = Router();
const userCtrl = new UserController();

authRoutes.get("/getUsers", async (req: Request, res: Response) => {
  try {
    const response = await userCtrl.getUsers();
    return res.status(response.code).json(response);
  } catch (err: any) {
    return res.status(err.code ? err.code : 500).json(err);
  }
});

authRoutes.post("/create", async (req: Request, res: Response) => {
  const { user } = req.body;

  try {
    const response = await userCtrl.createUser(user);
    return res.status(response.code).json(response);
  } catch (err: any) {
    return res.status(err.code ? err.code : 500).json(err);
  }
});

authRoutes.put("/update", async (req: Request, res: Response) => {
  const updateData = req.body.user;

  try {
    const response = await userCtrl.updateUser(updateData);
    return res.status(response.code).json(response);
  } catch (err: any) {
    return res.status(err.code ? err.code : 500).json(err);
  }
});

authRoutes.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await userCtrl.deleteUser(id);
    return res.status(response.code).json(response);
  } catch (err: any) {
    return res.status(err.code ? err.code : 500).json(err);
  }
});

authRoutes.get("/GetUserByEmail/:email", async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    const response = await userCtrl.getUserByEmail(email);
    return res.status(response.code).json(response);
  } catch (err: any) {
    return res.status(err.code ? err.code : 500).json(err);
  }
});

authRoutes.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const response = await userCtrl.loginUser(email, password);
    return res.status(response.code).json(response);
  } catch (err: any) {
    return res.status(err.code ? err.code : 500).json(err);
  }
});

export default authRoutes;
