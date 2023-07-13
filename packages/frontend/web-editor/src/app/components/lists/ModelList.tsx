
import GenericItemList from "./GenericItemList";
import GenericListItem from "./GenericListItem";
import { EuiPageTemplate } from "@elastic/eui";
import { CreateModelButton } from "../buttons/CreateItemButton";
const getFixtures = (count = 100): JSX.Element[] => {
  return Array.from(Array(count).keys()).map((e, i) => {
    return (<GenericListItem
    id={i}
    key={i}
    label={{
      name: `Model #${i}`,
      description: `This is model number ${i}`,
    }}
    path={`/models/${i}`}
  />)});
}

export default function ModelList(){
  return (
    <EuiPageTemplate panelled={false} offset={48} grow={true} restrictWidth={true}>
      <EuiPageTemplate.Header
        alignItems="center"
        pageTitle="Models"
        responsive={false}
        bottomBorder="extended"
        rightSideItems={[
          <CreateModelButton />
        ]}
      />
    <EuiPageTemplate.Section>
      <GenericItemList>
        {getFixtures()}
      </GenericItemList>
    </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}
