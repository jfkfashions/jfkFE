import React from 'react';
import { Container, Typography } from '@mui/material';

const ReportingPage = () => {
  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      <Typography variant="body1">
        View detailed reports and statistics here (coming soon).
      </Typography>
    </Container>
  );
};

export default ReportingPage;
