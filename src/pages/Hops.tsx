import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import withApollo from '../hoc/withApollo';
import { useQuery } from '@apollo/react-hooks';
import getHops from '../queries/getHops.graphql';
import { GetHops, GetHops_hops as Hop, GetHopsVariables } from '../__generated__/GetHops';
import Maybe from 'graphql/tsutils/Maybe';
import DataTable from '../components/DataTable';
import Error from 'next/error';

const useStyles = makeStyles<Theme>(theme => ({}));

const formatAcidValue = (low: Maybe<number>, high: Maybe<number>) => {
  if (low && high) {
    return low === high ? `${low.toFixed(1)}%` : `${low.toFixed(1)} - ${high.toFixed(1)}%`;
  }

  if (low) {
    return `${low.toFixed(1)}%`;
  }

  if (high) {
    return `${high.toFixed(1)}%`;
  }

  return '';
};

const Hops: React.FC = () => {
  const classes = useStyles();
  const { data, loading, error } = useQuery<GetHops, GetHopsVariables>(getHops);

  if (error) {
    return <Error statusCode={500} title="Unable to load page, please try again later" />;
  }

  return (
    <DataTable<Hop>
      data={data ? data.hops : null}
      label="Hops"
      initialSort="name"
      loading={loading}
      columns={[
        { id: 'name', header: 'Name', value: 'name', sortable: true },
        { id: 'origin', header: 'Origin', value: hop => hop.origin.name, sortable: true },
        {
          id: 'alpha',
          header: 'Alpha',
          numeric: true,
          value: hop => formatAcidValue(hop.aaLow, hop.aaHigh),
        },
        {
          id: 'beta',
          header: 'Beta',
          numeric: true,
          value: hop => formatAcidValue(hop.betaLow, hop.betaHigh),
        },
      ]}
    />
  );
};

export default withApollo(Hops);
