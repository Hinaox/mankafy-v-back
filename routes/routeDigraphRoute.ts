import { Router } from "express";
import RouteDigraphService from "../services/routeDigraphService.js";

const routeDigraphRouter = Router();

routeDigraphRouter.get("/byLocation", async (req, res) => {
  try {
    const locationIdStr = req.query.locationId;
    if (!locationIdStr)
      res.status(400).json({ error: "Unspecified locationId" });
    const locationId = parseInt(`${locationIdStr}`);

    const retour = await RouteDigraphService.findByLocation(locationId);
    res.json(retour);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

routeDigraphRouter.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const retour = await RouteDigraphService.find(id);
    res.json(retour);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default routeDigraphRouter;
