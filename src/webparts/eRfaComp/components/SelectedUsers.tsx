import * as React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { IUser } from './IERfaCompState';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import styles from './ERfaComp.module.scss';



export interface SelectedUsersProps {
    users: IUser[];
}

const options: IDropdownOption[] = [
    { key: 'Sequential', text: 'Sequential' },
    { key: 'Parallel', text: 'Parallel' }
  ];

const SortableItem = SortableElement(({value}) => 
    <div className={styles.divPanel}>
        <div className={styles.divContent}>{value.displayName} </div>
        <div className={styles.divContent}>No</div>
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
            <div className={styles.eRfaComp}>
                <div className={styles.titleText}>Informed {this.props.users.length}</div>
                <div className={styles.divPanel}>
                    <div className={styles.divSubPanel}>Assigned To</div>
                    <div className={styles.divSubPanel}>Informed</div>
                </div>
                <SortableList items={this.props.users}/>
            </div>
        );
    }
}