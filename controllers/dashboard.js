import { dashboardPostService , dashboardService,dashboardDeleteService} from "../services/dashboard.js";


export const dashboardController = async(req,res)=>{
    const result = dashboardService(req,res);

    return result;
}

export const postDataController = async(req,res)=>{
    const result = dashboardPostService(req,res);
    

    return result;
}


export const deleteDataController = async (req, res) => {
  return await dashboardDeleteService(req, res);
};