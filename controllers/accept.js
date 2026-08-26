import { acceptDataService } from "../services/accept.js";

export const acceptData = async (req, res) => {
    console.log(req.body);
  const result = await acceptDataService(req.body);

  return res.json(result);
};