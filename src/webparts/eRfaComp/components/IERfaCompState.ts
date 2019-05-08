export interface IERfaCompState {
    selectedApproversEndorsers: IUser[]; //For Approvers & Endorsers
    selectedApprovers: IUser[]; //For Approvers
    selectedEndorsers: IUser[]; //For Endorsers
    selectedInformed: IUser[]; //For Informed
    selectedApproverUsers: string[]; //TO prepopulate exising Approver Users
    selectedEndorderUsers: string[]; ////TO prepopulate exising Endorser Users
    selectedInformedUsers: string[]; //TO prepopulate exising Informed Users
} 

export interface IUser {
    displayName: string;
    email: string;
    userType?:string; //Approver/Endorser/Informed
    wfType?:string; //Sequential/Parallel
    UserNameAndType?: string; //User Name and Type
}

export interface ISelectedUser {
    Title: string;
    UserEmail: string;
    WFType?: string;
    UserType: string;
}