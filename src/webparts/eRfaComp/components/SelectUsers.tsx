import * as React from 'react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IERfaCompProps } from './IERfaCompProps';
import ERfaComp from './ERfaComp';

export interface ISelectUsersProps {
    context: WebPartContext;
}

export default class SelectUsers extends React.Component<{}, {}> {

    public render(): React.ReactElement<{}> {
        return(
            <div>
                <b>Select Users</b>
                <PeoplePicker
                    context={this.props.wpContext}
                    titleText="People Picker"
                    personSelectionLimit={3}
                    groupName={"Team Site Owners"} // Leave this blank in case you want to filter from all users
                    showtooltip={true}
                    isRequired={true}
                    disabled={true}
                    selectedItems={this._getPeoplePickerItems}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000} />
            </div>
        );
    }

    private _getPeoplePickerItems(items: any[]) {
        console.log('Items:', items);
    }
}