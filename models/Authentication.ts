export type AuthPayload = {
    token : string,
    profile : AuthProfile,
}

export type AuthProfile = {
    branch : string
    name : string
    isCK : string
}

export type LoginResponse = {
    name : string
    branch : string
    isCk : boolean
    accessToken : string
}