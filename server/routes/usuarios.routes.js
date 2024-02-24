import {Router} from 'express'
import {getUsers,getUser,createUser,deleteUser,updateUser} from '../controllers/user.controllers.js'

const router= Router();

router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;