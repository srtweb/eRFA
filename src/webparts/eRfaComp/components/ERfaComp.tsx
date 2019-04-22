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

let SortableList:any = '';

export default class ERfaComp extends React.Component<IERfaCompProps, IERfaCompState> {
  constructor(props: IERfaCompProps) {
    super(props);

    this.state = {
      selectedApproversEndorsers: [], //For Approvers and Endorsers
      selectedApprovers: [], //For Approvers
      selectedEndorsers: [], //For Endorsers
      selectedInformed: [] //For Informed
    };

    //This function executes when add/remove from Approvers
    this._getApprovers = this._getApprovers.bind(this);
    //This function executes when add/remove from Endorsers
    this._getEndorsers = this._getEndorsers.bind(this);
    //This function executes when add/remove from Endorsers
    this._getInformed = this._getInformed.bind(this);
    //Function works on drag/drop user name
    this._onSortEnd = this._onSortEnd.bind(this);
  }

  public render(): React.ReactElement<IERfaCompProps> {
    return (
      <div>
        {/* Displaying People Pickers */}
        <div className={ styles.eRfaComp }>
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
                resolveDelay={1000} />
        </div>
        
        {/* Displaying Selected Approvers and Endorsers
          Check ComponentDidMount for detailed strucure */}
        <div>
          { this.state.selectedApproversEndorsers.length > 0 &&
            <div>
              <SortableList items={this.state.selectedApproversEndorsers} onSortEnd={this._onSortEnd}/>  
            </div>
          }
        </div>
        
        {/* Displaying Selected Informed 
          Check ComponentDidMount for detailed strucure*/}  
        <div>
          { this.state.selectedInformed.length > 0 &&
            <div>
              <SortableList items={this.state.selectedInformed}/>  
            </div>
          }
        </div>

      </div>
    );
    
  }

  public componentDidMount(): void {
    let SortableItem = SortableElement(({value}) => 
      <div>
        <b>{value.displayName} - {value.userType}</b>
      </div>
    );

    //Populating users for drag and drop
    SortableList = SortableContainer(({items}) => {
      return (
        <ul>
          {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value} />
          ))}
        </ul>
      );
    });
  }

  
  //Move users
  private _onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({selectedApproversEndorsers}) => ({
      selectedApproversEndorsers: arrayMove(selectedApproversEndorsers, oldIndex, newIndex),
    }));
  }

  //Executes when add/remove users from People Picker control
  //Items = Selected PeoplePicker Users
  private _getApprovers(items: any[]) {
    let _users: IUser[] = [];

    if(items.length > 0) {
      //Go through all selected users
      items.map((item) => {
        //Build users array
        _users.push({displayName:item.text, email: item.secondaryText, userType: 'Approvers'});
      });
    }

    //Update SelectedApprovers state
    this.setState({
      selectedApprovers: _users,
    });

    if(this.state.selectedApproversEndorsers.length > 0) {
      let _alreadySelectedEndorsers = this.state.selectedEndorsers;
      //Merge Approvers and Endorsers
      this.setState({
        selectedApproversEndorsers: [..._users,..._alreadySelectedEndorsers]
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

    if(items.length > 0) {
      items.map((item) => {
        //Build selected Endorsers array
        _users.push({displayName:item.text, email: item.secondaryText, userType: 'Endorsers'});
      });
    }
    this.setState({
      selectedEndorsers: _users,
    });

    if(this.state.selectedApproversEndorsers.length > 0) {
      let _alreadySelectedApprovers = this.state.selectedApprovers;
      //Merge Approvers and Endorsers
      this.setState({
        selectedApproversEndorsers: [..._users,..._alreadySelectedApprovers]
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

    if(items.length > 0) {
      items.map((item) => {
        //Build selected Informed array
        _users.push({displayName:item.text, email: item.secondaryText, userType: 'Informed'});
      });
    }
    this.setState({
      selectedInformed: _users,
    });
  }
}
