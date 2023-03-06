import axios from "axios";
import { Branch, BranchList } from "../models/Branch";
import { commonHeader } from "./Authentication";

export const Create = async (token : string, req : Branch): Promise<void> => {
    const res = await axios.post(process.env.API_BASE_URL + '/api/v1/admin/repairs/branches', req, {
        headers : commonHeader(token)
    })
    return res.data;
}

export const Update = async (token : string, req : Branch, id : string): Promise<void> => {
    const res = await axios.patch(process.env.API_BASE_URL + '/api/v1/admin/repairs/branches/' + id, req, {
        headers : commonHeader(token)
    })
    return res.data;
}

export const GetBranchDetail = async (token : string, id : string): Promise<Branch> => {
    const res = await axios.get(process.env.API_BASE_URL + '/api/v1/admin/repairs/branches/' + id, {
        headers : commonHeader(token)
    })
    return res.data;
}

export const GetAllBranches = async (token : string): Promise<Array<BranchList>> => {
    const res = await axios.get(process.env.API_BASE_URL + '/api/v1/ck/branches', {
        headers : commonHeader(token)
    })
    return res.data;
}

export const Delete = async (token : string, id : string): Promise<void> => {
    const res = await axios.delete(process.env.API_BASE_URL + '/api/v1/admin/repairs/branches/' + id, {
        headers : commonHeader(token)
    })
    return res.data;
}
