import { GetYeast, GetYeastVariables, GetYeast_yeast as Yeast } from '../__generated__/GetYeast';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import DataTable from '../components/DataTable';
import Error from 'next/error';
import getYeast from '../queries/getYeast.graphql';
import React from 'react';
import withApollo from '../hoc/withApollo';

const useStyles = makeStyles<Theme>(theme => ({}));

const YeastPage: React.FC = () => {
  const classes = useStyles();

  const { data, loading, error } = useQuery<GetYeast, GetYeastVariables>(getYeast);

  if (error) {
    return <Error statusCode={500} title="Unable to load page, please try again later" />;
  }

  return (
    <DataTable<Yeast>
      data={data ? data.yeast : null}
      label="Yeast"
      initialSort="name"
      loading={loading}
      columns={[
        { id: 'name', header: 'Name', value: 'name', sortable: true },
        { id: 'lab', header: 'Lab', value: yeast => yeast.lab.name, sortable: true },
        { id: 'type', header: 'Type', value: 'type', sortable: true },
        { id: 'form', header: 'Form', value: 'form', sortable: true },
      ]}
    />
  );
};

export default withApollo(YeastPage);
