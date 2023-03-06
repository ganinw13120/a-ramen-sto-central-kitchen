import axios from "axios";
import { STODetail, STOListPayload } from "../models/STO";
import { commonHeader } from "./Authentication";

export const GetSTOList = async (token : string, page : number, pageSize : number, sortBy ?: string, filter ?: string): Promise<STOListPayload> => {
    const res = await axios.get(process.env.API_BASE_URL + `/api/v1/ck/stos?page=${page}&limit=${pageSize}${sortBy ? `&sortBy=${sortBy}`: ''}${filter??''}`, {
        headers : commonHeader(token)
    })
    return res.data;
}

export const GetSTODetail = async (token : string, id : string): Promise<STODetail> => {
    const res = await axios.get(process.env.API_BASE_URL + `/api/v1/ck/stos/${id}`, {
        headers : commonHeader(token)
    })
    return res.data;
}

export const GetStatuses = async (token : string): Promise<Array<string>> => {
    const res = await axios.get(process.env.API_BASE_URL + '/api/v1/ck/statuses', {
        headers : commonHeader(token)
    })
    return res.data;
}