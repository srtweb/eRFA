declare interface IERfaCompWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  ApproverButtonText: string;
  EndorsersButtonText: string;
  RejectedButtonText: string;
}

declare module 'ERfaCompWebPartStrings' {
  const strings: IERfaCompWebPartStrings;
  export = strings;
}
