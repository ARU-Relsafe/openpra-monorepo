import {EuiFlexGroup, EuiFlexItem, EuiText, EuiIcon, useEuiTheme, EuiHorizontalRule, EuiButtonIcon, EuiSpacer} from "@elastic/eui";
import DeleteItemBox from "../listchanging/deleteItemBox";
import { useState } from "react";


export default function (){

    const [deleteVisible, setDeleteVisible] = useState(false);

    function onDeleteClick(){
        setDeleteVisible(!deleteVisible)
    }

    const parameters = [
        {name: 'Parameter1', value: '5000'},
        {name: 'Parameter2', value: '6000'}
    ]

    const {euiTheme} = useEuiTheme();

    return (
        <EuiFlexGroup direction='column' alignItems="center" gutterSize="s">
            <EuiFlexItem grow={false} style={{marginTop: "20px", width: "1000px"}}>
                <EuiFlexGroup>
                    <EuiText style={{fontSize: '2rem', width: '47%'}}><strong>Parameter</strong></EuiText>
                    <EuiText style={{fontSize: '2rem'}}><strong>Value</strong></EuiText>
                </EuiFlexGroup>
                <EuiHorizontalRule style={{width: "1000px", marginTop: "10px", marginBottom: "0px"}}/>
            </EuiFlexItem>
            {parameters.map((param)=>(
                <EuiFlexItem grow={false} style={{backgroundColor: euiTheme.colors.lightShade, padding: '10px', width: "1000px", borderRadius: "4px"}}>
                    <EuiFlexGroup direction='row'>
                        <EuiText style={{fontSize: '1.5rem', width: '50%'}}> {param.name}</EuiText>
                        <EuiText style={{fontSize: '1.5rem', width: '40%'}}> {param.value} </EuiText>
                        <EuiButtonIcon color='text' onClick={onDeleteClick} iconType='trash' title='delete' style={{width: "10%"}}/>
                    </EuiFlexGroup>
                </EuiFlexItem>
            ))}
            {/** this is where the delete overlay mask will go for confiring a delete */}
        {deleteVisible && (
          <DeleteItemBox title='Global Parameter' page='model/1/globalparameters'></DeleteItemBox>
        )}
        </EuiFlexGroup>
        
    )
}