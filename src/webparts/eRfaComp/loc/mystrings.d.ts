declare interface IERfaCompWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ApproverButtonText: string; //Button text for Approvers
  EndorsersButtonText: string; //Button text for Endorsers
  RejectedButtonText: string; //Button text for Approvers/Endorsers
  SequentialText: string; //Options for Approvers/Endorsers
  ParallelText: string; //Options for Approvers/Endorsers
  UsersListName: string; //List name to save individual Users
}

declare module 'ERfaCompWebPartStrings' {
  const strings: IERfaCompWebPartStrings;
  export = strings;
}
