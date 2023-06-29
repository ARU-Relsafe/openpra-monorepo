import { EuiAccordion, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from "@elastic/eui";
import ModelItemsList from "./modelItemsList";
import SettingsOverview from '../smallcomponents/settingDropdowns/settingsOverview'
import EditCurrentModel from "../smallcomponents/settingDropdowns/editCurrentModel";

export default function(){

    const overviewLabel = (
        <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
        </EuiFlexGroup>
    )


    return(
        < EuiFlexGroup direction="column" style={{ alignItems: "center", width: "700px", marginLeft: "10px", marginRight: "10px", marginTop: "-20px"}}>

                <EditCurrentModel/>
                <EuiSpacer size='l'/>   
                <SettingsOverview/>
            <EuiAccordion
            id="accordion11"
            arrowDisplay="right"
            buttonContent="Advanced Settings"
            paddingSize="s">
                <EuiText>
                    <p>
                    Any content inside of <strong>EuiAccordion</strong> will appear here.
                    </p>
                </EuiText>
            </EuiAccordion>
        </EuiFlexGroup>
    )
}