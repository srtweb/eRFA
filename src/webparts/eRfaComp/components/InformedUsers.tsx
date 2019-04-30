import * as React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { IUser } from './IERfaCompState';
import styles from './ERfaComp.module.scss';

export interface InformedUsersProps {
    users: IUser[];
}

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

export class InformedUsers extends React.Component<InformedUsersProps,{}> {
    constructor(props:InformedUsersProps) {
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