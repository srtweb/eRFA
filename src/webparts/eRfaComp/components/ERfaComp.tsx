import * as React from 'react';
import styles from './ERfaComp.module.scss';
import { IERfaCompProps } from './IERfaCompProps';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IERfaCompState, IUser, ISelectedUser } from './IERfaCompState';
//https://github.com/clauderic/react-sortable-hoc
//https://www.npmjs.com/package/array-move
//https://www.npmjs.com/package/array-move
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { InformedUsers } from './InformedUsers';
import * as strings from 'ERfaCompWebPartStrings';
import { sp, ItemAddResult } from "@pnp/sp";

let SortableList: any = '';
let existingApproverUsers: string[] = [];
let existingEndorserUsers: string[] = []; 
let existingInformedUsers: string[] = [];

export default class ERfaComp extends React.Component<IERfaCompProps, IERfaCompState> {
  constructor(props: IERfaCompProps) {
    super(props);

    this.state = {
      selectedApproversEndorsers: [], //For Approvers and Endorsers
      selectedApprovers: [], //For Approvers
      selectedEndorsers: [], //For Endorsers
      selectedInformed: [], //For Informed
      selectedApproverUsers: [], //To prepopulate Approver PP
      selectedEndorderUsers: [], //To prepopulate Endorser PP
      selectedInformedUsers: [] //To prepopulate Informed PP
    };

    //This function executes when add/remove from Approvers
    this._getApprovers = this._getApprovers.bind(this);
    //This function executes when add/remove from Endorsers
    this._getEndorsers = this._getEndorsers.bind(this);
    //This function executes when add/remove from Endorsers
    this._getInformed = this._getInformed.bind(this);
    //Function works on drag/drop user name
    this._onSortEnd = this._onSortEnd.bind(this);
    //Executes on Radio selection change
    this._rdoOnChange = this._rdoOnChange.bind(this);
    //Executes when Drop down option changes
    this._wfSelectionChange = this._wfSelectionChange.bind(this);
    //Save
    this._saveItem = this._saveItem.bind(this);
  }

  

  public render(): React.ReactElement<IERfaCompProps> {
    return (
      <div className={styles.eRfaComp}>
        {/* Displaying People Pickers */}
        <div className={styles.eRfaComp}>
          <PeoplePicker
            context={this.props.currentContext}
            titleText="Approvers"
            personSelectionLimit={3}
            showtooltip={true}
            isRequired={false}
            selectedItems={this._getApprovers}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} 
            defaultSelectedUsers= {this.state.selectedApproverUsers} />

          <PeoplePicker
            context={this.props.currentContext}
            titleText="Endorsers"
            personSelectionLimit={3}
            showtooltip={true}
            isRequired={false}
            selectedItems={this._getEndorsers}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} 
            defaultSelectedUsers= {this.state.selectedEndorderUsers} />
          <PeoplePicker
            context={this.props.currentContext}
            titleText="Informed"
            personSelectionLimit={3}
            showtooltip={true}
            isRequired={false}
            selectedItems={this._getInformed}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000}
            defaultSelectedUsers= {this.state.selectedInformedUsers}
            />
        </div>

        {/* Displaying Selected Approvers and Endorsers
          Check ComponentDidMount for detailed strucure */}
        <div>
          {this.state.selectedApproversEndorsers.length > 0 &&
            <div>
              <div className={styles.titleText}>Selected Approvers/Endorsers {this.state.selectedApproversEndorsers.length}</div>
              <SortableList items={this.state.selectedApproversEndorsers} onSortEnd={this._onSortEnd} />
            </div>
          }
        </div>

        {/* Displaying Selected Informed 
          Check SelectedUsers.tsx for detailed strucure*/}
        <div>
          {this.state.selectedInformed.length > 0 &&
            <div>
              <InformedUsers users={this.state.selectedInformed} />
            </div>
          }
        </div>

        <input type='button' id='saveItem' name='Save' value='Save Item' onClick={this._saveItem} />
      </div>
    );

  }

  private _getExisingEmpData(): void {
    /* Get exising data from SP List
    * 
    *
    */
    let eInformed: string = '[{"displayName":"Srikanth Tiyyaguru","email":"srikanth@srtweb.onmicrosoft.com","userType":"Informed"}]';
    let eEndorser: string = '[{"displayName":"Ravi Coyajee","email":"RCoyajee@srtweb.onmicrosoft.com","userType":"Endorsers","wfType":"Sequential","UserNameAndType":"Ravi CoyajeeEndorsers"},{"displayName":"Srikanth Tiyyaguru","email":"srikanth@srtweb.onmicrosoft.com","userType":"Endorsers","wfType":"Sequential","UserNameAndType":"Srikanth TiyyaguruEndorsers"}]';
    let eApprover: string = '[{"displayName":"Ravi Coyajee","email":"RCoyajee@srtweb.onmicrosoft.com","userType":"Approvers","wfType":"Sequential","UserNameAndType":"Ravi CoyajeeEndorsers"},{"displayName":"Srikanth Tiyyaguru","email":"srikanth@srtweb.onmicrosoft.com","userType":"Approvers","wfType":"Parallel","UserNameAndType":"Srikanth TiyyaguruApprovers"}]';

    let existingApprover: IUser[] = [];
    let existingEndorser: IUser[] = [];
    let existingInformed: IUser[] = [];
    let existingApproversEndorsers: IUser[] = [];
    //Approvers
    if(eApprover.length > 0) {
      //Convert JSON to array (IUser[])
      existingApprover = JSON.parse(eApprover);
      if(existingApprover.length > 0) {
        //Populate 'existingInformedUsers' - Used to pre-populate People Picker 
        existingApprover.map(selecteduser => {
          existingApproverUsers.push(selecteduser.email);
        });
      }
    }

    //Endorsers
    if(eEndorser.length > 0) {
      //Convert JSON to array (IUser[])
      existingEndorser = JSON.parse(eEndorser);
      if(existingEndorser.length > 0) {
        //Populate 'existingInformedUsers' - Used to pre-populate People Picker 
        existingEndorser.map(selecteduser => {
          existingEndorserUsers.push(selecteduser.email);
        });
      }
    }

    //Informed
    if(eInformed.length > 0) {
      //Convert JSON to array (IUser[])
      existingInformed = JSON.parse(eInformed);
      if(existingInformed.length > 0) {
        //Populate 'existingInformedUsers' - Used to pre-populate People Picker 
        existingInformed.map(selecteduser => {
          existingInformedUsers.push(selecteduser.email);
        });
      }
    }

    //Update State
    this.setState({
      selectedApproverUsers: existingApproverUsers, //To populate PP
      selectedApprovers: existingApprover,
      selectedEndorderUsers: existingEndorserUsers,
      selectedEndorsers: existingEndorser,
      selectedInformedUsers: existingInformedUsers,
      selectedInformed: existingInformed,
      selectedApproversEndorsers: [...existingApprover, ...existingEndorser] //Merge Approvers and Endorsers
    });

  }

  //Get the items based on eRFA Number
  private _getSelectedUserItems(erfaNo: string): ISelectedUser[] {
    let selectedUsers: ISelectedUser[] = [];

    //Get items using PnP
    sp.web.lists.getByTitle(strings.UsersListName).items.select('Title', 'UserEmail', 'WFType', 'UserType').filter("Title eq '" + erfaNo + "'").get().then((items: ISelectedUser[]) => {
      console.log(items);
  });

    return selectedUsers;
  }

  //Add items to Users list
  private _addUser(userToAdd: IUser): void {
    sp.web.lists.getByTitle(strings.UsersListName).items.add({
      Title: userToAdd.displayName,
      UserEmail: userToAdd.email,
      WFType: userToAdd.wfType,
      UserType: userToAdd.userType
      }).then((iar: ItemAddResult) => {
        console.log(iar);
    });
  }

  private _saveItem() {
    console.log('saving...');
    /*
    * Save to SPList
    * eApprover - Multi line
    * eEndorser - Multi line
    * eInformed - Multi line
    * 
    */
   let eApprover: string = '';
   let eEndorser: string = '';
   let eInformed: string = '';
    if(this.state.selectedApprovers != null && 
        typeof(this.state.selectedApprovers) != undefined &&
        this.state.selectedApprovers.length > 0) {
          eApprover = JSON.stringify(this.state.selectedApprovers);

          //Save individual users
          for(let iUser of this.state.selectedApprovers) {
            this._addUser(iUser)
          }
    }

    
    if(this.state.selectedEndorsers != null && 
      typeof(this.state.selectedEndorsers) != undefined &&
      this.state.selectedEndorsers.length > 0) {
        eEndorser = JSON.stringify(this.state.selectedEndorsers);
    }
    
    if(this.state.selectedInformed != null && 
      typeof(this.state.selectedInformed) != undefined &&
      this.state.selectedInformed.length > 0) {
        eInformed = JSON.stringify(this.state.selectedInformed);
    }

    //Save eApprover, eEndorser and eInformed to SP List

    //Save individual items


  }

 
  public componentDidMount(): void {
    //this._getExisingEmpData();
    this._getSelectedUserItems('1');

    let SortableItem = SortableElement(({ value }) =>
      <div>
        <b>{value.displayName} - {value.userType}</b>
        {/*  DO NOT DELETE
        <input type='radio' name={value.displayName} value='Sequential' onChange={this._rdoOnChange} />Sequential
        <input type='radio' name={value.displayName} value='Parallel' onChange={this._rdoOnChange} />Parallel
        */}
        <select id={value.displayName} onChange={this._wfSelectionChange}>
          <option value={strings.ParallelText}>{strings.ParallelText}</option>
          <option value={strings.SequentialText}>{strings.SequentialText}</option>
        </select>

        {/* Buttons should be enabled only for current logged in user
        {(this.props.currentContext.pageContext.user.displayName == value.displayName)
          ?
          <div>
            <input type='button' id={value.displayName + 'Approve'} name='btnApprove' value={strings.ApproverButtonText} />
            <input type='button' id={value.displayName + 'Reject'} name='btnReject' value={strings.RejectedButtonText} />
          </div>
          :
          <div>
            <input type='button' id={value.displayName + 'Approve'} name='btnApprove' value={strings.ApproverButtonText} disabled />
            <input type='button' id={value.displayName + 'Reject'} name='btnReject' value={strings.RejectedButtonText} disabled />
          </div> 
        }*/}
      </div>
    );

    //Populating users for drag and drop
    SortableList = SortableContainer(({ items }) => {
      return (
        <ul>
          {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value} />
          ))}
        </ul>
      );
    });
  }

  /* Executes on WF Type drop down selection change.
  Update State with selected drop down options */
  private _wfSelectionChange(event) {
    if (this.state.selectedApproversEndorsers.length > 0) {
      let _users: IUser[] = [];

      this.state.selectedApproversEndorsers.map(selecteduser => {
        if (selecteduser.displayName === event.target.id) {
          _users.push({ displayName: selecteduser.displayName, email: selecteduser.email, userType: selecteduser.userType, wfType: event.target.value, UserNameAndType: selecteduser.UserNameAndType });
        }
        else {
          _users.push(selecteduser);
        }
      });

      this.setState({
        selectedApproversEndorsers: _users
      });
    }
  }


  /* Executes on Radio selection change.
  Updating State with selected Radio options */
  private _rdoOnChange(event) {
    console.log(event.target.name + ' - ' + event.target.value);
    if (this.state.selectedApproversEndorsers.length > 0) {
      let _users: IUser[] = [];

      this.state.selectedApproversEndorsers.map(selecteduser => {
        if (selecteduser.displayName === event.target.name) {
          _users.push({ displayName: selecteduser.displayName, email: selecteduser.email, userType: selecteduser.userType, wfType: event.target.value, UserNameAndType: selecteduser.UserNameAndType });
        }
        else {
          _users.push(selecteduser);
        }
      });

      this.setState({
        selectedApproversEndorsers: _users
      });
    }
  }

  //Move users
  private _onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex != newIndex) {
      this.setState(({ selectedApproversEndorsers }) => ({
        selectedApproversEndorsers: arrayMove(selectedApproversEndorsers, oldIndex, newIndex),
      }));
    }
  }

  //Executes when add/remove users from People Picker control
  //Items = Selected PeoplePicker Users
  private _getApprovers(items: any[]) {
    let _users: IUser[] = [];

    if (items.length > 0) {
      //Go through all selected users
      items.map((item) => {
        //Build users array
        _users.push({ displayName: item.text, email: item.secondaryText, userType: 'Approvers', wfType: 'Sequential', UserNameAndType: item.text + 'Approvers' });
      });
    }

    //Update SelectedApprovers state
    this.setState({
      selectedApprovers: _users,
    });

    if (this.state.selectedEndorsers.length > 0) {
      let _alreadySelectedEndorsers = this.state.selectedEndorsers;
      //Merge Approvers and Endorsers
      this.setState({
        selectedApproversEndorsers: [..._users, ..._alreadySelectedEndorsers]
      });
    }
    else {
      this.setState({
        selectedApproversEndorsers: _users
      });
    }
  }

  //Executes when add/remove users from Endorsers People Picker control
  //Items = Selected PeoplePicker Users
  private _getEndorsers(items: any[]) {
    let _users: IUser[] = [];

    if (items.length > 0) {
      items.map((item) => {
        //Build selected Endorsers array
        _users.push({ displayName: item.text, email: item.secondaryText, userType: 'Endorsers', wfType: 'Sequential', UserNameAndType: item.text + 'Endorsers' });
      });
    }

    this.setState({
      selectedEndorsers: _users,
    });
    

    if (this.state.selectedApprovers.length > 0) {
      let _alreadySelectedApprovers = this.state.selectedApprovers;
      //Merge Approvers and Endorsers
      this.setState({
        selectedApproversEndorsers: [..._users, ..._alreadySelectedApprovers]
      });
    }
    else {
      this.setState({
        selectedApproversEndorsers: _users
      });
    }
  }

  //Executes when add/remove users from Informed People Picker
  private _getInformed(items: any[]) {
    let _users: IUser[] = [];

    //If the People Picker controls have users
    if (items.length > 0) {
      items.map((item) => {
        //Build selected Informed array
        _users.push({ displayName: item.text, email: item.secondaryText, userType: 'Informed' });
      });
    }

    //Update State
    this.setState({
      selectedInformed: _users,
    });
  }
}
