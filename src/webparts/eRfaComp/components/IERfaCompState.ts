export interface IERfaCompState {
    selectedUsers: IUser[];
    items: string[];
} 

export interface IUser {
    displayName: string;
    email: string;
}