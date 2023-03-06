export type Branch = {
    id?: string,
    name: string;
    address: string;
    no_seats: string;
    information_branch: InformationBranch;
    typeWorkTime: "always" | "sometime";
    workTime: WorkTime | null;
}

export type InformationBranch = {
    phone_branch: string;
    manager: string;
    phone_manger: string;
}

export type WorkTime = {
    startAt: string;
    endAt: string;
}

export type BranchList = {
    id: string,
    name: string,
}

export type BranchPayload = {
    total : number
    page : number
    branches : Array<BranchList>
}