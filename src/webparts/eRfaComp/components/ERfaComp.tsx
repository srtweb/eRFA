import * as React from 'react';
import styles from './ERfaComp.module.scss';
import { IERfaCompProps } from './IERfaCompProps';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IERfaCompState, IUser } from './IERfaCompState';
//https://github.com/clauderic/react-sortable-hoc
//https://www.npmjs.com/package/array-move
//https://www.npmjs.com/package/array-move
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { SelectedUsers } from './SelectedUsers';
import * as strings from 'ERfaCompWebPartStrings';

let SortableList: any = '';
let existingInformedUsers: string[] = [];

export default class ERfaComp extends React.Component<IERfaCompProps, IERfaCompState> {
  constructor(props: IERfaCompProps) {
    super(props);

    this.state = {
      selectedApproversEndorsers: [], //For Approvers and Endorsers
      selectedApprovers: [], //For Approvers
      selectedEndorsers: [], //For Endorsers
      selectedInformed: [], //For Informed
      selectedInformedUsers: []
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
            resolveDelay={1000} />

          <PeoplePicker
            context={this.props.currentContext}
            titleText="Endorsers"
            personSelectionLimit={3}
            showtooltip={true}
            isRequired={false}
            selectedItems={this._getEndorsers}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />
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
              <SelectedUsers users={this.state.selectedInformed} />
            </div>
          }
        </div>

        <input type='button' id='saveItem' name='Save' value='Save Item' onClick={this._saveItem} />
      </div>
    );

  }

  private _getExisingEmpData(): void {
    let eInformed: string = '[{"displayName":"Srikanth Tiyyaguru","email":"srikanth@srtweb.onmicrosoft.com","userType":"Informed"}]';
    let eData: string = '[{"displayName":"Ravi Coyajee","email":"RCoyajee@srtweb.onmicrosoft.com","userType":"Endorsers","wfType":"Sequential","UserNameAndType":"Ravi CoyajeeEndorsers"},{"displayName":"Srikanth Tiyyaguru","email":"srikanth@srtweb.onmicrosoft.com","userType":"Approvers","wfType":"Sequential","UserNameAndType":"Srikanth TiyyaguruApprovers"}]';

    if(eInformed.length > 0) {
      //Convert JSON to array (IUser[])
      let existingInformed: IUser[] = JSON.parse(eInformed);
      if(existingInformed.length > 0) {
        //Populate 'existingInformedUsers' - Used to pre-populate People Picker 
        existingInformed.map(selecteduser => {
          existingInformedUsers.push(selecteduser.email);
        });

        //Update State
        this.setState({
          selectedInformedUsers: existingInformedUsers,
          selectedInformed: existingInformed
        });
      }
    }

  }

  private _saveItem() {
    console.log('saving...');
  }

  public componentDidMount(): void {
    this._getExisingEmpData();

    let SortableItem = SortableElement(({ value }) =>
      <div>
        <b>{value.displayName} - {value.userType}</b>
        {/*  DO NOT DELETE
        <input type='radio' name={value.displayName} value='Sequential' onChange={this._rdoOnChange} />Sequential
        <input type='radio' name={value.displayName} value='Parallel' onChange={this._rdoOnChange} />Parallel
        */}
        <select id={value.displayName} onChange={this._wfSelectionChange}>
          <option value="Sequential">Sequential</option>
          <option value="Parallel">Parallel</option>
        </select>

        {/* Buttons should be enabled only for current logged in user */}
        {(this.props.currentContext.pageContext.user.displayName == value.displayName)
          ?
          <div>
            <input type='button' id={value.displayName + 'Approve'} name='btnApprove' value={value.userType} />
            <input type='button' id={value.displayName + 'Reject'} name='btnReject' value={strings.RejectedButtonText} />
          </div>
          :
          <div>
            <input type='button' id={value.displayName + 'Approve'} name='btnApprove' value={value.userType} disabled />
            <input type='button' id={value.displayName + 'Reject'} name='btnReject' value={strings.RejectedButtonText} disabled />
          </div>
        }
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
        if (selecteduser.displayName === event.id.name) {
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

      //Update SelectedApprovers state
      this.setState({
        selectedApprovers: _users,
      });
    }

    if (this.state.selectedApproversEndorsers.length > 0) {
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
      
      this.setState({
        selectedEndorsers: _users,
      });
    }
    

    if (this.state.selectedApproversEndorsers.length > 0) {
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
