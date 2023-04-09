import axios from "axios";
import { EditPayload, STODetail, STOListPayload } from "../models/STO";
import { commonHeader } from "./Authentication";
var FileSaver = require('file-saver');

export const GetSTOList = async (token: string, page: number, pageSize: number, sortBy?: string, filter?: string): Promise<STOListPayload> => {
    const res = await axios.get(process.env.API_BASE_URL + `/api/v1/ck/stos?page=${page}&limit=${pageSize}${sortBy ? `&sortBy=${sortBy}` : ''}${filter ?? ''}`, {
        headers: commonHeader(token)
    })
    return res.data;
}

export const GetSTODetail = async (token: string, id: string): Promise<STODetail> => {
    const res = await axios.get(process.env.API_BASE_URL + `/api/v1/ck/stos/${id}`, {
        headers: commonHeader(token)
    })
    return res.data;
}

export const GetStatuses = async (token: string): Promise<Array<string>> => {
    const res = await axios.get(process.env.API_BASE_URL + '/api/v1/ck/statuses', {
        headers: commonHeader(token)
    })
    return res.data;
}

export const Reject = async (token: string, id: string, reason: string): Promise<STODetail> => {
    const res = await axios.patch(process.env.API_BASE_URL + `/api/v1/ck/stos/${id}/reject`, {
        reason: reason
    }, {
        headers: commonHeader(token)
    })
    return res.data;
}

export const Approve = async (token: string, id: string): Promise<STODetail> => {
    const res = await axios.patch(process.env.API_BASE_URL + `/api/v1/ck/stos/${id}/approve`, {}, {
        headers: commonHeader(token)
    })
    return res.data;
}

export const Edit = async (token: string, id: string, req: EditPayload): Promise<STODetail> => {
    const res = await axios.patch(process.env.API_BASE_URL + `/api/v1/ck/stos/${id}`, req, {
        headers: commonHeader(token)
    })
    return res.data;
}

export const GetPDF = async (token: string, id: string): Promise<void> => {

    const options = {
        headers: commonHeader(token)
    };
    fetch(process.env.API_BASE_URL + `/api/v1/ck/stos/${id}/pdf`, options)
        .then(res => res.blob())
        .then(blob => {
            FileSaver.saveAs(blob, `ใบคำสั่งซื้อ ${id}.pdf`);
        });
}
