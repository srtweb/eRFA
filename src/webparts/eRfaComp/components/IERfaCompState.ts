export interface IERfaCompState {
    selectedApproversEndorsers: IUser[]; //For Approvers & Endorsers
    selectedApprovers: IUser[]; //For Approvers
    selectedEndorsers: IUser[]; //For Endorsers
    selectedInformed: IUser[]; //For Informed
    selectedInformedUsers: string[];
} 

export interface IUser {
    displayName: string;
    email: string;
    userType?:string; //Approver/Endorser/Informed
    wfType?:string; //Sequential/Parallel
    UserNameAndType?: string; //User Name and Type
}