import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import withApollo from '../hoc/withApollo';
import {
  GetFermentables_fermentables as Fermentable,
  GetFermentables,
  GetFermentablesVariables,
} from '../__generated__/GetFermentables';
import getFermentables from '../queries/getFermentables.graphql';
import DataTable from '../components/DataTable';
import Error from 'next/error';

const useStyles = makeStyles<Theme>(theme => ({}));

const Fermentables: React.FC = () => {
  const classes = useStyles();
  const { data, loading, error } = useQuery<GetFermentables, GetFermentablesVariables>(
    getFermentables
  );

  if (error) {
    return <Error statusCode={500} title="Unable to load page, please try again later" />;
  }

  return (
    <DataTable<Fermentable>
      data={data ? data.fermentables : null}
      label="Fermentables"
      initialSort="name"
      loading={loading}
      columns={[
        { id: 'name', header: 'Name', value: 'name', sortable: true },
        { id: 'origin', header: 'Origin', value: hop => hop.origin.name, sortable: true },
        { id: 'category', header: 'Category', value: 'category', sortable: true },
        { id: 'grainType', header: 'Grain Type', value: 'grainType', sortable: true },
        { id: 'color', header: 'Color, °L', value: 'color', sortable: true, numeric: true },
        {
          id: 'potential',
          header: 'Potential, SG',
          value: fermentable => fermentable.potential.toFixed(3),
          sortable: true,
          numeric: true,
        },
        { id: 'yield', header: 'Yield, %', value: 'yield', sortable: true, numeric: true },
      ]}
    />
  );
};

export default withApollo(Fermentables);
