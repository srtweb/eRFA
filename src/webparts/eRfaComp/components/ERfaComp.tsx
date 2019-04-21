import * as React from 'react';
import styles from './ERfaComp.module.scss';
import { IERfaCompProps } from './IERfaCompProps';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IERfaCompState, IUser } from './IERfaCompState';
//https://github.com/clauderic/react-sortable-hoc
//https://www.npmjs.com/package/array-move
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

let _selectedUsers: IUser[];

let SortableList:any = '';

export default class ERfaComp extends React.Component<IERfaCompProps, IERfaCompState> {
  constructor(props: IERfaCompProps) {
    super(props);

    this.state = {
      selectedUsers: []
    };

    //This function executes when add/remove from People
    this._getPeoplePickerItems = this._getPeoplePickerItems.bind(this);
    this._onSortEnd = this._onSortEnd.bind(this);
  }

  public render(): React.ReactElement<IERfaCompProps> {
    return (
      <div>
        <div className={ styles.eRfaComp }>
        <PeoplePicker
              context={this.props.currentContext}
              titleText="Select Users"
              personSelectionLimit={3}
              showtooltip={true}
              isRequired={true}
              selectedItems={this._getPeoplePickerItems}
              showHiddenInUI={false}
              principalTypes={[PrincipalType.User]}
              resolveDelay={1000} />
        <div>

        </div>
          { this.state.selectedUsers.length > 0 &&
            <div>
              <SortableList items={this.state.selectedUsers} onSortEnd={this._onSortEnd}/>  
            </div>
          }
        </div>
      </div>
    );
  }

  public componentDidMount(): void {
    let SortableItem = SortableElement(({value}) => <div><b>{value}</b></div>);

    //Populating users for drag anf drop
    SortableList = SortableContainer(({items}) => {
      return (
        <ul>
          {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value.displayName} />
          ))}
        </ul>
      );
    });
  }

  //Move users
  private _onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({selectedUsers}) => ({
      selectedUsers: arrayMove(selectedUsers, oldIndex, newIndex),
    }));
  }

  //Executes when add/remove users to People Picker control
  //Items = Selected PeoplePicker Users
  private _getPeoplePickerItems(items: any[]) {
    let _users: IUser[] = [];

    if(items.length > 0) {
      items.map((item) => {
        _users.push({displayName:item.text, email: item.secondaryText})
      });
    }
    this.setState({
      selectedUsers: _users
    });
  }
}
