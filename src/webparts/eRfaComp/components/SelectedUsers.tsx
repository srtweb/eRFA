import * as React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { IUser } from './IERfaCompState';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';


export interface SelectedUsersProps {
    users: IUser[];
}

const options: IDropdownOption[] = [
    { key: 'Sequential', text: 'Sequential' },
    { key: 'Parallel', text: 'Parallel' }
  ];

const SortableItem = SortableElement(({value}) => 
    <div>
        <div>
            <b>{value.displayName} - {value.userType}</b>
        </div>
        <div>
            <Label>More controls here..</Label>
        </div>
    </div>
    );

//Populating users for drag and drop
const SortableList = SortableContainer(({items}) => {
      return (
        <ul>
          {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value} />
          ))}
        </ul>
      );
    });

export class SelectedUsers extends React.Component<SelectedUsersProps,{}> {
    constructor(props:SelectedUsersProps) {
        super(props);
    }

   
    public render(): React.ReactElement<any> {
        return(
            <div>
                <SortableList items={this.props.users}/> 
            </div>
        );
    }
}