export type STO = {
    id: number
    branch: string
    status: string
    updatedAt: string
    createdAt: string
}

export type STOListPayload = {
    filter: PaginationFilter
    total: number
    items: STO[]
}

export type PaginationFilter = {
    skip: number
    limit: number
}


export type Tracking = {
    status: string;
    note?: any;
    editedAt: string;
    productEditings: any[];
}

export type Product = {
    id: number;
    description: string;
    sku: string;
    imageUrl: string;
    correspondingQuantity: number;
    uop: string;
    uom: string;
    category: string;
}

export type OrderedProduct = {
    quantity: number;
    product: Product;
}

export type STODetail = {
    branchName: string
    status: string;
    pdf?: string;
    createdAt: string;
    updatedAt: string;
    tracking: Tracking[];
    orderedProducts: OrderedProduct[];
}

export type EditPayload = {
    note : string
    items : EditItemPayload[]
}

export type EditItemPayload = {
    productId : number
    newQuantity : number
}