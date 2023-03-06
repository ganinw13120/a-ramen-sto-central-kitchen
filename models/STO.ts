export type STO = {
    id : number
    branch : string
    status : string
    updatedAt : string
    createdAt : string
}

export type STOListPayload = {
    filter : PaginationFilter
    total : number
    items : STO[]
}

export type PaginationFilter = {
    skip : number
    limit : number
}