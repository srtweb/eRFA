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
      selectedUsers: [],
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']
    };

    this._addUsersClicked = this._addUsersClicked.bind(this);
    this._getPeoplePickerItems = this._getPeoplePickerItems.bind(this);
  }

  public render(): React.ReactElement<IERfaCompProps> {

    return (
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
            <PrimaryButton onClick={this._addUsersClicked}>
              Add Users
            </PrimaryButton>
        </div>
        <div>
          <SortableList items={this.state.items} onSortEnd={this.onSortEnd}/>  
        </div>
      </div>
    );
  }

  public componentDidMount(): void {
    const SortableItem = SortableElement(({value}) => <li>{value}</li>);

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

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({items}) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));
  };

  //Executes when add/remove users to People Picker control
  private _getPeoplePickerItems(items: any[]) {
    console.log('Items:', items);
    let _users: IUser[] = [];
    if(items.length > 0) {
      items.map((item) => {
        _users.push({displayName:item.text, email: item.secondaryText})
      })
      
      this.setState
    }
  }

  private _addUsersClicked(): void {
    this.setState({
      selectedUsers: _selectedUsers
    });
  }
}
