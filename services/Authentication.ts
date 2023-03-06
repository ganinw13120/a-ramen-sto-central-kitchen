import axios from "axios";
import { GetServerSidePropsContext, PreviewData } from "next";
import nookies, { parseCookies, setCookie } from "nookies";
import { ParsedUrlQuery } from "querystring";
import { AuthPayload, AuthProfile, LoginResponse } from "../models/Authentication";

export const SaveLogin = (accessToken: string) => {
    setCookie(null, "token", accessToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
    })
}

export const Logout = (ctx ?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
    nookies.destroy(ctx, "token");
}

export const commonHeader = (token : string) => {
    return {
        "Authorization" : "Bearer " + token
    }
}

const GetProfile = async (token : string) : Promise<AuthProfile> => {
    const res = await axios.get(process.env.API_BASE_URL + '/api/v1/user/profile', {
        headers : commonHeader(token)
    })
    return res.data;
}

export const Verify = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) : Promise<AuthPayload> => {
    const { token } = parseCookies(ctx);
    if (!token) return Promise.reject("Token not found");
    let profile : AuthProfile;
    try {
        profile = await GetProfile(token);
    } catch (err) {
        console.error(err)
        Logout(ctx);
        return Promise.reject("Authentication failed");
    }
    return {
        token : token,
        profile : profile
    }
}

export const Login = async (username : string, password : string): Promise<LoginResponse> => {
    const res = await axios.post(process.env.API_BASE_URL + '/api/v1/auth/login', {
        username: username,
        password: password,
    })
    return res.data;
}